import { AppconfigService } from 'app/services/appconfig.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chordaloptions',
  templateUrl: './chordaloptions.component.html',
  styleUrls: ['./chordaloptions.component.scss']
})
export class ChordaloptionsComponent implements OnInit {

  @ViewChild('f') form;
  constructor(public appservice: AppconfigService) { }

  ngOnInit() {
    // this.form.valueChanges.subscribe(data => console.log('Form changes', data));
    // this.dataprovider.IncludeDiagnosis = true;
    // this.dataprovider.IncludeMeds = true;
    // this.dataprovider.removeOther = false;
  }

  public onSumbit() {
  }
}
