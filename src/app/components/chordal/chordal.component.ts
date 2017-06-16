import { forEach } from '@angular/router/src/utils/collection';
import { AresElement, AresMatrix, DataproviderService, AresChord } from '../../services/dataprovider.service';
import { Subscription } from 'rxjs/Rx';

import * as assert from 'assert';
import { D3, D3Service, Selection, ColorCommonInstance, D3ZoomEvent, ScaleOrdinal, ChordGroup, Chords, BaseType, RibbonGenerator, Ribbon, RibbonSubgroup, Arc, DefaultArcObject } from 'd3-ng2-service';
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
/// <reference path="../../../../node_modules/@types/snapsvg/index.d.ts" />
import * as Snap from 'snapsvg-cjs';
import { MdSnackBar } from '@angular/material';
import { ChordLayout } from '@types/d3-chord';
// import { ColorCommonInstance } from "@types/d3-color";
// declare var Snap: any;

@Component({
  selector: 'app-chordal',
  templateUrl: './chordal.component.html',
  styleUrls: ['./chordal.component.scss']
})
export class ChordalComponent implements OnInit {
  arc: Arc<any, DefaultArcObject>;
  ribbon: RibbonGenerator<any, Ribbon, RibbonSubgroup>;

  private d3: D3;
  private d3G: Selection<SVGGElement, any, null, undefined>;
  private anchorGroup: Selection<BaseType, Chords, null, undefined>;
  parentElement: any;
  d3ParentElement: Selection<HTMLElement, any, null, undefined>;
  private svg: Selection<SVGSVGElement, any, null, undefined>;

  private color: ScaleOrdinal<string, {}>;

  private chord: ChordLayout;

  private abotChordFetch = false;
  private fetchTimer: NodeJS.Timer;

  dataSubscription: Subscription;

  chordSubscription: Subscription;
  data: AresMatrix;

  width: number;
  height: number;
  // private matrix = [
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  //   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]

  // ];


  constructor(d3Service: D3Service, element: ElementRef, public dataprovider: DataproviderService, private snackbar: MdSnackBar) {
    this.d3 = d3Service.getD3();
    this.parentElement = element.nativeElement;
    assert(this.d3);


  }

  ngOnInit() {
    if (this.parentElement === null) {
      return;
    }
    // this.dataprovider.matrixChanged.subscribe(null, null, (e) => this.updateChord());

    // this.dataSubscription = this.dataprovider.data.subscribe(result => this.InitChordal(result));
    // this.dataprovider.GetAresMatrix().subscribe();
    this.dataSubscription = this.dataprovider.itemList.subscribe(result => this.InitChordal());
    this.chordSubscription = this.dataprovider.chordList.subscribe((chordlist) => this.updateChord(chordlist));
    this.dataprovider.GetItemlist().subscribe();
    this.width = this.parentElement.parentElement.clientWidth;
    this.height = this.parentElement.parentElement.clientHeight;





    // const height = svg.height.valueOf();

    // const test = height + width;
  }
@HostListener('window:resize', ['$event.target'])
onResize() {
  this.resizeWorks();
}
private resizeWorks(): void {
  this.d3G.selectAll().remove();
  this.d3G.remove();
  this.width = this.parentElement.parentElement.clientWidth;
  this.height = this.parentElement.parentElement.clientHeight;
  this.InitChordal();
}
  ngOnDestroy() {
    if (this.svg.empty && !this.svg.empty()) {
      this.svg.selectAll('*').remove();
    }
  }

  private InitChordal() {
    let d3G: Selection<SVGGElement, any, null, undefined>;
    // console.log('Updating chordal.');
    if (this.dataprovider.matrix == null || this.dataprovider.matrix.length === 0) {
      return;
    }
    console.log('Updating chordal.');

    if (this.d3G != null){
        this.d3G.selectAll().remove();
       this.d3G.remove();
    }





    // this.data = data;
    const d3 = this.d3;
    this.d3ParentElement = this.d3.select(this.parentElement);
    this.svg = this.d3ParentElement.select<SVGSVGElement>('svg');


    function zoomed(this: SVGSVGElement) {
      const e: D3ZoomEvent<SVGSVGElement, any> = d3.event;
      d3G.attr('transform', e.transform.toString());
    }

    // const test = Snap(800, 600) as Snap.Paper;
    // test.circle(150, 150, 100);

    // svg.add;
    const width = this.width;
    const height = this.height;
    const outerRadius = Math.min(width, height) * 0.5 - 140;
    const bandThickness = 30;
    const innerRadius = outerRadius - bandThickness;

    const formatValue = d3.formatPrefix(',.0', 1e3);
    this.chord = d3.chord()
      .padAngle(0.005)
      .sortGroups(null)
      .sortSubgroups(null)
      .sortChords(null);
    // .sortGroups((chord1) => {
    //     return 1;
    // });
    // .sortSubgroups(d3.ascending)
    // .sortChords(d3.ascending);

    this.arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    this.ribbon = d3.ribbon().radius(innerRadius);
    const range = d3.range(10);
    const rangeStr = new Array<string>();
    for (const i of range) {
      rangeStr.push(i.toString());
    }

    // tslint:disable-next-line:max-line-length
    this.color = d3.scaleOrdinal().domain(rangeStr).range(['#9C6744', '#C9BEB9', '#CFA07E', '#C4BAA1', '#C2B6BF', '#121212', '#8FB5AA', '#85889E', '#9C7989', '#91919C', '#242B27', '#212429', '#99677B', '#36352B', '#33332F', '#2B2B2E', '#2E1F13', '#2B242A', '#918A59', '#6E676C', '#6E4752', '#6B4A2F', '#998476', '#8A968D', '#968D8A', '#968D96', '#CC855C', '#967860', '#929488', '#949278', '#A0A3BD', '#BD93A1', '#65666B', '#6B5745', '#6B6664', '#695C52', '#56695E', '#69545C', '#565A69', '#696043', '#63635C', '#636150', '#333131', '#332820', '#302D30', '#302D1F', '#2D302F', '#CFB6A3', '#362F2A']);
    this.createColorsForItems();
    d3G = this.d3G = this.svg.append<SVGGElement>('g');

    this.anchorGroup = d3G.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .datum(this.chord(this.dataprovider.matrix));

    const group = this.anchorGroup.append('g')
      // .attr('class', 'groups')
      .selectAll('g')
      .data((chords) => { return chords.groups; })
      .enter()
      .append('g');


    group.append('path')
      .on('mouseover', (e) => {
        const item = this.dataprovider.itemListSubject.getValue()[(e as ChordGroup).index];
        this.snackbar.open(item.label);
        // Läuft gerade ein timeout?
        if (this.fetchTimer != null) {
          clearTimeout(this.fetchTimer);
        }
        // this.fetchTimer = setTimeout(() => this.mouseOverChord(e), 400);
        // this.mouseOverChord(e);
      })
      .on('click', (e) => this.mouseOverChord(e))
      .on('mouseout', (e) => {
        if (this.fetchTimer != null) {
          clearTimeout(this.fetchTimer);
          this.fetchTimer = null;
        }
      })
      .style('fill', (d) => { return this.dataprovider.itemListSubject.getValue()[d.index].color as any; })
      .style('stroke', (d) => {
        const item = this.dataprovider.itemListSubject.getValue()[d.index];
        if (item.type === 'Dx'){
          return d3.rgb(250, 0, 0, 0.8 ) as any;
        } else {
          return d3.rgb(0, 0, 250, 0.8) as any;
        }

        // return this.dataprovider.itemListSubject.getValue()[d.index].color.brighter(1) as any;
      })
      .attr('stroke-width', '0.008em')
      .attr('d', this.arc as any);

    // .attr('dy', (element) => {
    //   const angle = element.endAngle - element.startAngle;
    //   const em = 3 * angle;
    //   return em.toString() + 'em';
    // })

    group.append('text')
      .attr('dy', '0.35em')

      .text((element) => {
        const item = this.dataprovider.itemListSubject.getValue()[element.index];
        return this.getLabel(item, (((element.startAngle + element.endAngle) / 2) > Math.PI));
      })
      .attr('fill', '#ffffff')
      .attr('font-size', (e) => {
        const angle = e.endAngle - e.startAngle;
        let fontSize = angle * 360;
        if (fontSize > 20) {
          fontSize = 20;
        }
        if (fontSize < 1){
          fontSize = 1;
        }
        return fontSize.toString();
      })
      .attr('transform', (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const r = 'rotate(' + (angle * 180 / Math.PI - 90) + ')';
        const t = ' translate(' + (innerRadius + bandThickness) + ')';
        return r + t + (angle > Math.PI ? ' rotate(180)' : ' rotate(0)');
      })
      .attr('text-anchor', function (d) {
        return ((d.startAngle + d.endAngle) / 2) > Math.PI ? 'end' : 'begin';
      });

    // this.updateChord();
    const zoom = d3.zoom<SVGSVGElement, any>()
      .scaleExtent([1 / 4, 16])
      .on('zoom', zoomed);
    zoom.scaleBy(this.d3G.selectAll(), 3);
    this.svg.call(zoom);


    // g.append('g')
    //   .attr('class', 'ribbons')
    //   .selectAll('path')
    //   .data((chords) => { return chords; })
    //   .enter()
    //   .append('path')
    //   .attr('d', ribbon as any)
    //   .style('fill', (d) => { return color(d.target.index.toString()) as any; })
    //   .style('stroke', (d) => { return d3.rgb(color(d.target.index.toString()) as ColorCommonInstance).darker().toString(); });



  }



  private mouseOverChord(group: ChordGroup) {
    const e = this.dataprovider.itemListSubject.getValue()[group.index];
    // this.snackbar.open(e.label);
    console.log(e.label + ' -> mouseover');
    this.dataprovider.GetChordlist(e.id).subscribe();
  }

  private updateChord(chordlist: Array<AresChord>) {
    if (chordlist.length === 0) {
      return;
    }
    console.log('Updating chords.');
    // this.d3G.selectAll('g').remove();


    // this.chord(this.dataprovider.matrix);
    // this.anchorGroup.selectAll('ribbons').remove();
    // const test = this.anchorGroup.selectAll('path.chord');
    // test.remove();
    // this.anchorGroup.selectAll('g').remove();
    this.anchorGroup.datum(this.chord(this.dataprovider.matrix));
    // const group = this.anchorGroup.append('g')
    //   // .attr('class', 'groups')
    //   .selectAll('g')
    //   .data((chords) => { return chords.groups; })
    //   .enter()
    //   .append('g');

    // group.append('path')
    // .on('mouseover', (e) => this.mouseOverChord(e))
    //   .style('fill', (d) => { return this.dataprovider.itemListSubject.getValue()[d.index].color as any; })
    //   .style('stroke', (d) => { return this.dataprovider.itemListSubject.getValue()[d.index].color.brighter(1) as any; })
    //   .attr('stroke-width', '0.008em')
    //   .attr('d', this.arc as any);

    this.anchorGroup.selectAll('g.ribbons').remove();
    this.anchorGroup.selectAll('path.chord').remove();
    this.anchorGroup.append('g')
      .attr('class', 'ribbons')
      .selectAll('path')
      .data((chords) => { return chords; })
      .enter()
      .append('path')
      .attr('class', 'chord')
      .attr('d', this.ribbon as any)
      // tslint:disable-next-line:max-line-length
      .attr('id', (d) => { return this.dataprovider.itemListSubject.getValue()[d.source.index].id + ' -> ' + this.dataprovider.itemListSubject.getValue()[d.target.index].id; })
      .attr('display', (d) => { return (this.dataprovider.itemListSubject.getValue()[d.source.index].id === this.dataprovider.itemListSubject.getValue()[d.target.index].id) ? 'none' : ''; })
      .style('fill', (d) => { return this.dataprovider.itemListSubject.getValue()[d.target.index].color as any; })
      .style('stroke', (d) => { return this.dataprovider.itemListSubject.getValue()[d.target.index].color as any; })
      .style('opacity', (d) => {
        if (d.source.index === d.target.index) {
          return 0;
        }
        const start = this.dataprovider.itemListSubject.getValue()[d.source.index];
        const end = this.dataprovider.itemListSubject.getValue()[d.target.index];
        if (start.id === end.id) {
          return 0;
        }
        if (end.id === 'Other') {
          return 1;
        }
        return this.dataprovider.getChordOpacity(this.dataprovider.getChord(start.id, end.id)) as any;
      });

    // const test = this.anchorGroup.selectAll('.chord');

    // this.anchorGroup.selectAll('path.chord').transition().duration(1000).attr('opacity', '0.1');
  }
  private createColorsForItems() {
    const arr = this.dataprovider.itemListSubject.getValue();
    let i = 0;
    let groupIndex = 0;
    let lastGroup = arr[0].id.substr(0, 1);
    let startColor = this.d3.rgb(this.color(groupIndex.toString()) as any);
    arr.forEach(element => {
      if (lastGroup !== element.id.substr(0, 1)) {
        i = 0;
        lastGroup = element.id.substr(0, 1);
        groupIndex++;
        const test = this.color(groupIndex.toString());
        startColor = this.d3.rgb(this.color(groupIndex.toString()) as any);
      }
      element.color = startColor.brighter(i / (1 + 4 * arr.length / 200));
      i++;
      // element.color = this.d3.rgb();
    });
  }
  private getLabel(e: AresElement, reverse: boolean): string {
    let label = '';
    const maxStringLength = 25;
    if (e.label.length < maxStringLength) {
      label = e.label;
    } else {
      label = e.label.substr(0, maxStringLength - 3) + '...';
    }
    if (reverse) {
      return `(${label}) ${e.id} - ${e.type}`;
    } else {
      return `${e.type} - ${e.id} (${label})`;
    }

  }
}

