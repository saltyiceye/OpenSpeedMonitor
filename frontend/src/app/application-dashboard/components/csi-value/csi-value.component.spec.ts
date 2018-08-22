import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CsiValueComponent} from './csi-value.component';
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {TranslateModule} from "@ngx-translate/core";
import {CalculationUtil} from "../../../shared/utils/calculation.util";

describe('CsiValueComponent', () => {
  let component: CsiValueComponent;
  let fixture: ComponentFixture<CsiValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CsiValueComponent],
      imports: [
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsiValueComponent);
    component = fixture.componentInstance;
    component.csiValue = 0;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be described as CSI since no description is set', () =>{
    expect(component.description).toEqual('CSI');
    const descriptionEl: HTMLElement = fixture.debugElement.query(By.css('.csi-value-description')).nativeElement;
    expect(descriptionEl.textContent).toEqual('CSI');
  });
  it('should be described as "CSI" if the circle is not big', () => {
    component.isBig = false;
    component.ngOnInit();
    expect(component.description).toEqual('CSI');

    fixture.detectChanges();
    const descriptionEl: HTMLElement = fixture.debugElement.query(By.css('.csi-value-description')).nativeElement;
    expect(descriptionEl.textContent).toEqual('CSI');
  });
  it('should be bad if csi value is bad', () => {
    const badValue: number = 69.4;
    component.csiValue =  badValue;
    component.ngOnInit();
    expect(component.csiValueClass).toEqual('bad');

    fixture.detectChanges();
    const circleDe: DebugElement = fixture.debugElement;
    const svgDe: DebugElement = circleDe.query(By.css('svg'));
    expect(svgDe.classes.bad).toBeTruthy();
    expect(svgDe.classes.okay).toBeFalsy();
    expect(svgDe.classes.good).toBeFalsy();
  });
  it('should be okay if csi value is okay', () => {
    const okayValue: number = 70;
    component.csiValue =  okayValue;
    component.ngOnInit();
    expect(component.csiValueClass).toEqual('okay');

    fixture.detectChanges();
    const circleDe: DebugElement = fixture.debugElement;
    const svgDe: DebugElement = circleDe.query(By.css('svg'));
    expect(svgDe.classes.bad).toBeFalsy();
    expect(svgDe.classes.okay).toBeTruthy();
    expect(svgDe.classes.good).toBeFalsy();
  });
  it('should be good if csi value is good', () => {
    const goodValue: number = 90;
    component.csiValue =  goodValue;
    component.ngOnInit();
    expect(component.csiValueClass).toEqual('good');

    fixture.detectChanges();
    const circleDe: DebugElement = fixture.debugElement;
    const svgDe: DebugElement = circleDe.query(By.css('svg'));
    expect(svgDe.classes.bad).toBeFalsy();
    expect(svgDe.classes.okay).toBeFalsy();
    expect(svgDe.classes.good).toBeTruthy();
  });

  it('should be small by default', ()=>{
    const expectedSize: number = 75;
    expect(component.size).toBe(expectedSize);
    const expectedValueFontSize: string = '18';
    expect(component.valueFontSize).toBe(expectedValueFontSize);
    const expectedDescriptionFontSize: string = '12';
    expect(component.descriptionFontSize).toBe(expectedDescriptionFontSize);

    const containerDe: DebugElement = fixture.debugElement.query(By.css('.csi-circle-container'));
    const containerEl: HTMLElement = containerDe.nativeElement;
    expect(containerEl.clientWidth).toBe(expectedSize);
  });
  it('should be big if set', ()=>{
    component.isBig = true;
    component.ngOnInit();

    const expectedSize: number = 150;
    expect(component.size).toBe(expectedSize);
    const expectedValueFontSize: string = '34';
    expect(component.valueFontSize).toBe(expectedValueFontSize);
    const expectedDescriptionFontSize: string = '14';
    expect(component.descriptionFontSize).toBe(expectedDescriptionFontSize);

    fixture.detectChanges();
    const containerDe: DebugElement = fixture.debugElement.query(By.css('.csi-circle-container'));
    const containerEl: HTMLElement = containerDe.nativeElement;
    expect(containerEl.clientWidth).toBe(expectedSize);
  });
  it('should be described by the date of the recent csi date if the csi date is not today and the circle is big', () => {
    component.isBig = true;
    component.csiDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substring(0, 10);
    component.ngOnInit();

    expect(component.description).toBe(CalculationUtil.toGermanDateFormat(component.csiDate));
    fixture.detectChanges();
    const descriptionEl: HTMLElement = fixture.debugElement.query(By.css('.csi-value-description')).nativeElement;
    expect(descriptionEl.textContent).toEqual(CalculationUtil.toGermanDateFormat(component.csiDate));
  });
  it('should be grey if the csi is outdated', () => {
    const goodValue: number = 90;
    component.csiValue = goodValue;
    component.csiDate = new Date("01.02.2017").toISOString();
    component.lastResultDate = new Date("01.03.2017").toISOString();
    component.ngOnInit();

    expect(component.isOutdated).toBe(true);
    expect(component.csiValueClass).toEqual('outdated');

    fixture.detectChanges();
    const circleDe: DebugElement = fixture.debugElement;
    const svgDe: DebugElement = circleDe.query(By.css('svg'));
    expect(svgDe.classes.bad).toBeFalsy();
    expect(svgDe.classes.okay).toBeFalsy();
    expect(svgDe.classes.good).toBeFalsy();
    expect(svgDe.classes.outdated).toBeTruthy();
  });
  it('should be good if csi value is good and up-to-date', () => {
    const goodValue: number = 90;
    component.csiValue = goodValue;
    component.csiDate = new Date("01.02.2017").toISOString();
    component.lastResultDate = new Date("01.02.2017").toISOString();
    component.ngOnInit();

    expect(component.isOutdated).toBe(false);
    expect(component.csiValueClass).toEqual('good');

    fixture.detectChanges();
    const circleDe: DebugElement = fixture.debugElement;
    const svgDe: DebugElement = circleDe.query(By.css('svg'));
    expect(svgDe.classes.bad).toBeFalsy();
    expect(svgDe.classes.okay).toBeFalsy();
    expect(svgDe.classes.good).toBeTruthy();
    expect(svgDe.classes.outdated).toBeFalsy();
  });
  it('should be described by "CSI" and be "outdated" (grey) if the csi value is outdated and the circle is small', () => {
    const goodValue: number = 90;
    component.csiValue = goodValue;
    component.isBig = false;
    component.csiDate = new Date("01.02.2017").toISOString();
    component.lastResultDate = new Date("02.02.2017").toISOString();
    component.ngOnInit();

    expect(component.isOutdated).toBe(true);
    expect(component.description).toBe('CSI');
    expect(component.csiValueClass).toEqual('outdated');

    fixture.detectChanges();
    const descriptionEl: HTMLElement = fixture.debugElement.query(By.css('.csi-value-description')).nativeElement;
    expect(descriptionEl.textContent).toEqual('CSI');

    const circleDe: DebugElement = fixture.debugElement;
    const svgDe: DebugElement = circleDe.query(By.css('svg'));
    expect(svgDe.classes.bad).toBeFalsy();
    expect(svgDe.classes.okay).toBeFalsy();
    expect(svgDe.classes.good).toBeFalsy();
    expect(svgDe.classes.outdated).toBeTruthy();
  });
});
