import { AppconfigService } from '../../services/appconfig.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maptest',
  templateUrl: './maptest.component.html',
  styleUrls: ['./maptest.component.scss']
})
export class MaptestComponent implements OnInit {

  constructor(public appconfig: AppconfigService) { }

  ngOnInit() {
  }

}
