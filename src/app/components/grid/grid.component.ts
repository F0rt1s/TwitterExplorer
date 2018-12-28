import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid/main';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
public gridOptions: GridOptions;
  constructor() {
    this.gridOptions = {};
    this.gridOptions.enableSorting = true;
    this.gridOptions.enableColResize = true;
    this.gridOptions.enableFilter = false;
    this.gridOptions.pagination = false;
    this.gridOptions.paginationPageSize = 200;

    this.gridOptions.columnDefs = [
      {
        headerName: 'start',
        field: 'start',
        width: 60
      },
      {
        headerName: 'end',
        field: 'end',
        // cellRendererFramework: RedComponentComponent,
        width: 60
      },
      {
        headerName: 'percent',
        field: 'percent',
        // cellRendererFramework: RedComponentComponent,
        // width: 200
      },

    ];
   }

  ngOnInit() {
  }
// constructor(public start: string, public end: string, public percent: number) { }
}
