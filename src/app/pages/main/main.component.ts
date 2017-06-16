import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  routes: Object[] = [{
    title: 'Formtests',
    route: '/',
    icon: 'dashboard',
  },
  {
    title: 'Maps',
    route: '/map',
    icon: 'dashboard',
  }
  ];

  constructor() { }

  ngOnInit() {
  }

}
