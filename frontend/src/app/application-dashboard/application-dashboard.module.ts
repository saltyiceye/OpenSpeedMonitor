import {NgModule} from '@angular/core';
import {ApplicationDashboardComponent} from './application-dashboard.component';
import {ApplicationSelectComponent} from './components/application-select/application-select.component';
import {SharedModule} from "../shared/shared.module";
import {PageListComponent} from './components/page-list/page-list.component';
import {ApplicationDashboardService} from "./services/application-dashboard.service";
import {PageComponent} from './components/page/page.component';
import {ApplicationCsiComponent} from './components/application-csi/application-csi.component';
import {ApplicationDashboardEntryComponent} from './application-dashboard.entry-component'
import {RouterModule, Routes} from "@angular/router";
import {CsiValueComponent} from "./components/csi-value/csi-value.component";
import { CsiGraphComponent } from './components/csi-graph/csi-graph.component';
import { CsiInfoComponent } from './components/csi-info/csi-info.component';

const DashboardRoutes: Routes = [
  {path: '', component: ApplicationDashboardComponent},
  {path: ':applicationId', component: ApplicationDashboardComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [
    ApplicationDashboardEntryComponent,
    ApplicationDashboardComponent,
    ApplicationSelectComponent,
    ApplicationCsiComponent,
    PageListComponent,
    PageComponent,
    CsiValueComponent,
    CsiGraphComponent,
    CsiInfoComponent
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: 'components',
      useValue: [ApplicationDashboardEntryComponent],
      multi: true
    },
    ApplicationDashboardService
  ],
  entryComponents: [ApplicationDashboardEntryComponent]
})
export class ApplicationDashboardModule {
}
