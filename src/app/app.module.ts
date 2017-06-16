import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { CovalentCommonModule, CovalentLayoutModule, CovalentLoadingModule } from '@covalent/core';
// (optional) Additional Covalent Modules imports
import { CovalentHttpModule } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';


import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { StartupComponent } from './components/startup/startup.component';
import { AppconfigService } from './services/appconfig.service';
import { MaptestComponent } from './components/maptest/maptest.component';
import { FormtestComponent } from './components/formtest/formtest.component';
import { ChordalComponent } from './components/chordal/chordal.component';

// D3
import { D3Service } from 'd3-ng2-service';
import { ChordaloptionsComponent } from './components/chordaloptions/chordaloptions.component';
import { DataproviderService } from 'app/services/dataprovider.service';
import { GridComponent } from './components/grid/grid.component';

// AG Grid
import {AgGridModule} from 'ag-grid-angular/main';

const appRoutes: Routes = [
  {path: '', component: MainComponent, children: [{component: StartupComponent, path: ''}]},
  {path: 'map', component: MainComponent, children: [{component: MaptestComponent, path: ''}]}
];

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    StartupComponent,
    MaptestComponent,
    FormtestComponent,
    ChordalComponent,
    ChordaloptionsComponent,
    GridComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    MaterialModule,
    CovalentCommonModule,
    CovalentLoadingModule,
    CovalentLayoutModule,
    AgGridModule.withComponents(GridComponent),
    // (optional) Additional Covalent Modules imports
    CovalentHttpModule.forRoot(),
    CovalentHighlightModule,
    CovalentMarkdownModule,
    CovalentDynamicFormsModule,
  ],
  providers: [AppconfigService, D3Service, DataproviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
