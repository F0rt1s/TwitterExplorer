import { AppconfigService } from '../../services/appconfig.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss']
})
export class StartupComponent implements OnInit {

  constructor(public appconfig: AppconfigService) { }

  ngOnInit() {
  }

}
