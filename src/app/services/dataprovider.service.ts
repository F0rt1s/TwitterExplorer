import { Http, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { AppconfigService } from './appconfig.service';
import { LoadingMode, LoadingType, TdLoadingService } from '@covalent/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Injectable, EventEmitter } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { ColorCommonInstance } from 'd3-ng2-service';
import { element } from 'protractor';
import * as assert from 'assert';

@Injectable()
export class DataproviderService {

  public dataSubject = new BehaviorSubject<AresMatrix>(new AresMatrix());
  public data: Observable<AresMatrix>;
  public matrix: Array<Array<number>>;

  public itemListSubject = new BehaviorSubject<Array<AresElement>>(new Array<AresElement>());
  public itemList: Observable<Array<AresElement>>;

  public chordListSubject = new BehaviorSubject<Array<AresChord>>(new Array<AresChord>());
  public chordList: Observable<Array<AresChord>>;
  public maxChordPercentage = 0;

  public unique: Array<AresElement>;
  public pageSize = 500;
  public IncludeDiagnosis = true;
  public IncludeMeds = true;
  public removeOther = false;

  lastChordindex = -1;

  // public matrixChanged: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http, private appconfig: AppconfigService, public loadingService: TdLoadingService, private snackbar: MdSnackBar) {
    this.loadingService.create({
      name: 'loading',
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: 'accent',
    });

    this.data = this.dataSubject.asObservable();
    this.itemList = this.itemListSubject.asObservable();
    this.chordList = this.chordListSubject.asObservable();
  }

  /**
   * GetAresMatrix
   */
  public GetAresMatrix() {
    console.log('Requesting matrix from server.');
    this.loadingService.register('loading');
    const requestOptions = new RequestOptions();
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', '1');
    params.set('pagesize', '200');
    requestOptions.params = params;
    return this.http.get(this.appconfig.serviceUrl + '/getmatrix', requestOptions)
      .map(response => this.mapAresMatrix(response.json() as AresMatrix))
      .catch(this.handleError);
  }

  public GetItemlist(): Observable<Response> {
    console.log('Requesting matrix from server.');
    this.loadingService.register('loading');
    const requestOptions = new RequestOptions();
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', '1');
    params.set('pagesize', this.pageSize.toString());
    params.set('includeDx', this.IncludeDiagnosis.toString());
    params.set('includeRx', this.IncludeMeds.toString());

    requestOptions.params = params;
    return this.http.get(this.appconfig.serviceUrl + '/GetItems', requestOptions)
      .map(response => this.mapItemList(response.json() as Array<AresElement>))
      .catch(this.handleError);
  }

  public GetChordlist(chord: string): Observable<Response> {
    if (chord === 'Other') {
      console.log(`Aborting chord ${chord} request from server.`);
      return;
    }

    console.log(`Requesting chord ${chord} from server.`);
    // this.loadingService.register('loading');
    const requestOptions = new RequestOptions();
    const params: URLSearchParams = new URLSearchParams();
    params.set('chord', chord);
    params.set('includeDx', this.IncludeDiagnosis.toString());
    params.set('includeRx', this.IncludeMeds.toString());

    requestOptions.params = params;
    return this.http.get(this.appconfig.serviceUrl + '/GetChord', requestOptions)
      .map(response => this.mapChordList(response.json() as Array<AresChord>))
      .catch(this.handleError);
  }

  private mapAresMatrix(result: AresMatrix) {
    this.createMatrix(result);
    this.dataSubject.next(result);
    console.log(`Received matrix from server. Array is ${result.matrix.length} elements long.`);
    this.loadingService.resolve('loading');
  }

  private mapItemList(arr: Array<AresElement>) {
    if (this.removeOther){
        const other = this.getItem('Other', arr);
        if (other != null){
          other.value1 = 1;
        }
    }
    this.createEmptyMatrixFromList(arr);

    this.itemListSubject.next(arr);
    console.log(`Created empty matrix. Matrix size is ${arr.length}x${arr.length} elements long.`);
    this.loadingService.resolve('loading');
  }

  private getItem(id: string, arr: Array<AresElement>): AresElement{
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id){
          return arr[i];
        }

      }
      return null;
  }

  private mapChordList(arr: Array<AresChord>) {
    if (arr.length === 0) {
      return;
    }
    this.updateMatrixWithChords(arr);
    arr.forEach((e) => {
      if (e.percent > this.maxChordPercentage){
        this.maxChordPercentage = e.percent;
      }
    });
    this.chordListSubject.next(arr);
    console.log(`mapChordList pushed new ChordList`);
    // this.loadingService.resolve('loading');
    // this.matrixChanged.emit(null);
  }
  private handleError(error: Response | any) {
    if (this.loadingService != null) {
        this.loadingService.resolve('loading');
    }


    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    this.snackbar.open('Error fetching data: ' + errMsg, 'Ok', {
      duration: 6000
    });

    return Observable.throw(errMsg);
  }

  private createEmptyMatrixFromList(arr: Array<AresElement>) {
    // this.unique = this.getUniqueItems(arr);
    this.matrix = new Array<Array<number>>();
    for (let i = 0; i < arr.length; i++) {
      this.matrix.push(new Array<number>());
      for (let k = 0; k < arr.length; k++) {
        const selfElement = new MatrixEntry();
        selfElement.edgeWeight = arr[i].value1;
        selfElement.item1 = arr[i].id;
        selfElement.label1 = arr[i].label;
        selfElement.typ1 = arr[i].type;

        selfElement.item2 = arr[k].id;
        selfElement.label2 = arr[k].label;
        selfElement.typ2 = arr[k].type;
        if (arr[i].id === arr[k].id) {
          selfElement.edgeWeight = arr[i].value1;
        } else {
          selfElement.edgeWeight = 0;
        }
        this.matrix[i].push(selfElement.edgeWeight);
      }
    }

  }


  private updateMatrixWithChords(chords: Array<AresChord>) {
    // Index für das item in der matrix
    const index = this.getIndexInMatrixForItem(chords[0].start);
    if (this.lastChordindex > -1){
      const m = this.matrix[this.lastChordindex];
      for (let i = 0; i < m.length; i++) {
        m[i] = 0;
      }

      m[this.lastChordindex] = this.itemListSubject.getValue()[this.lastChordindex].value1;
    }
    let summe2 = 0;
    this.matrix[index].forEach((e) => {summe2 += e; });
    console.log(summe2);


    this.lastChordindex = index;
    const item = this.itemListSubject.getValue()[index];
    // Für das Array in der Matrix die Werte neu setzen
    const itemArray = this.matrix[index];
    let otherPrecentage = 0;
    // Alle items in der chords item liste durchlaufen und für jedes den index ermitteln.
    // Items die wir nicht finden liegen im Bereich Others
    // Die Selbstreferenz in der Matrix auf 0 setzen
    chords.forEach(chord  => {
      const chordIndex = this.getIndexInMatrixForItem(chord.end);
      if (chordIndex === -1){
        // Other
        otherPrecentage += chord.percent;
      } else {
        this.matrix[index][chordIndex] = item.value1 * chord.percent  / 100;
      }
    });
    const otherIndex = this.getIndexInMatrixForItem('Other');
    this.matrix[index][otherIndex] = otherPrecentage  / 100 * item.value1;
    this.matrix[index][index] = 0;
    // Testen ob die Summe gleich der Value ist
    let summe = 0;
    this.matrix[index].forEach((e) => {summe += e; });
    console.log(summe);
    // assert(summe === this.itemListSubject.getValue()[index].value1, `Fail matrix sum does not match. Diff is ${summe - this.itemListSubject.getValue()[index].value1}`);
    let percent = 0;
    chords.forEach((e) => {percent += e.percent; });
    console.log(percent);

  }

  private getIndexInMatrixForItem(id: string): number{
    const arr = this.itemListSubject.getValue();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return i; }
    }
    return -1;
  }
  private createMatrix(arr: AresMatrix) {
    this.unique = this.getUniqueItems(arr);
    this.matrix = new Array<Array<number>>();
    for (let i = 0; i < this.unique.length; i++) {
      this.matrix.push(new Array<number>());
      for (let k = 0; k < this.unique.length; k++) {
        if (this.unique[i] === this.unique[k]) {
          const selfElement = new MatrixEntry();
          selfElement.edgeWeight = 0;
          selfElement.item1 = this.unique[i].id;
          selfElement.item2 = this.unique[i].id;

          this.matrix[i].push(selfElement.edgeWeight);
        } else {
          const element = this.getMatrixElement(this.unique[i].id, this.unique[k].id, arr);
          this.matrix[i].push(element.edgeWeight);
        }
      }
    }

  }

  public getChord(startId: string, endId: string): AresChord {

    const chords = this.chordListSubject.getValue();
    for (let i = 0; i < chords.length; i++) {
      if (chords[i].start === startId && chords[i].end === endId) {
        return chords[i];
      }
  }
  return null;
}
public getChordOpacity(chord: AresChord): number {
  if (chord == null){
    return 0;
  }
  let opacity = chord.percent  / this.maxChordPercentage * 100;
  console.log(opacity);
  if (opacity > 1){
    opacity = 1;
  }
  if (opacity < 0.1){
    opacity = 0.1;
  }
  return opacity;
}
  private getUniqueItems(arr: AresMatrix): Array<AresElement> {
    const uniqueArray = new Array<string>();
    const aresArray = new Array<AresElement>();
    for (let i = 0; i < arr.matrix.length; i++) {
      const test = arr.matrix[i].item1;
      if (uniqueArray.indexOf(test) === -1) {
        uniqueArray.push(test);

        aresArray.push(new AresElement(arr.matrix[i].item1, arr.matrix[i].label1, arr.matrix[i].typ1, arr.matrix[i].edgeWeight));
      }
    }
    return aresArray;

  }
  private getMatrixElement(item1: string, item2: string, array: AresMatrix) {
    // const array = this.dataSubject.getValue().matrix;
    for (let i = 0; i < array.matrix.length; i++) {
      if (array.matrix[i].item1 === item1 && array.matrix[i].item2 === item2) {
        return array.matrix[i];
      }

    }
  }
}




export class AresMatrix {
  public matrix = new Array<MatrixEntry>();

  // public List<MatrixEntry> Matrix { get; set; }
}

export class AresElement {
  public color: ColorCommonInstance;
  constructor(public id: string, public label: string, public type: string, public value1: number) { }
}

export class AresChord {
  constructor(public start: string, public end: string, public percent: number) { }
}


export class MatrixEntry {
  public item1: string;
  public label1: string;
  public typ1: string;
  public item2: string;
  public label2: string;
  public typ2: string;
  public edgeWeight: number;

  public valueOf(): number {
    return this.edgeWeight;
  }
  // public string Item1 { get; set; }
  // public string Label1 { get; set; }
  // public string Typ1 { get; set; }
  // public decimal ValueSize1 { get; set; }

  // public string Item2 { get; set; }
  // public string Label2 { get; set; }
  // public string Typ2 { get; set; }
  // public decimal ValueSize2 { get; set; }

  // public decimal EdgeWeight { get; set; }
}
