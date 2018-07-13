import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ReplaySubject} from "rxjs/index";
import {PageDto} from "../models/page.model";
import {MetricsDto} from "../models/metrics.model";
import {ApplicationCsiListDTO} from "../models/csi-list.model";
import {JobGroupDTO} from "../../shared/models/job-group.model";

@Injectable()
export class ApplicationDashboardService {
  metrics$: ReplaySubject<MetricsDto[]> = new ReplaySubject<MetricsDto[]>(1);
  pages$: ReplaySubject<PageDto[]> = new ReplaySubject<PageDto[]>(1);
  csiValues$: ReplaySubject<ApplicationCsiListDTO> = new ReplaySubject<ApplicationCsiListDTO>(1);

  constructor(private http: HttpClient) {
  }

  private updateMetricsForApplication(params) {
    this.http.get<MetricsDto[]>('/applicationDashboard/rest/getMetricsForApplication', {params: params})
      .subscribe((response: MetricsDto[]) => this.metrics$.next(response), error => this.handleError(error));
  }

  private updatePagesForApplication(params) {
    this.http.get<PageDto[]>('/applicationDashboard/rest/getPagesForApplication', {params: params})
      .subscribe((response: PageDto[]) => this.pages$.next(response), error => this.handleError(error))
  }

  private updateCsiForApplication(params) {
    this.http.get<ApplicationCsiListDTO>('/applicationDashboard/rest/getCsiValuesForApplication', {params: params})
      .subscribe((response: ApplicationCsiListDTO) => this.csiValues$.next(response), error => this.handleError(error));
  }

  updateApplicationData(application: JobGroupDTO) {
    const params = this.createParams(application.id);
    this.updateMetricsForApplication(params);
    this.updatePagesForApplication(params);
    this.updateCsiForApplication(params);
  }

  private handleError(error: any) {
    console.log(error);
  }

  private createParams(applicationId: number) {
    return {
        applicationId: applicationId ? applicationId.toString() : ""
      }
  }

}

