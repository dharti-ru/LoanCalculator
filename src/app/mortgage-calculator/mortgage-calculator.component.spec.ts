import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculationService } from '../services/calculation.service';

import { MortgageCalculatorComponent } from './mortgage-calculator.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { emiData, extraParams } from '../shared/mock';

class CalcService{
  additionalParams = extraParams;
  calcEmiData(){
    return emiData;
  }
  formatDecimal(n:number,decimalPlace:number){
    return parseFloat(parseFloat(n.toPrecision(10)).toFixed(decimalPlace));
  }
}

describe('MortgageCalculatorComponent', () => {
  let component: MortgageCalculatorComponent;
  let fixture: ComponentFixture<MortgageCalculatorComponent>;
  let calcService: CalculationService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortgageCalculatorComponent ],
      imports: [FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTableModule,
        MatGridListModule,
        MatTooltipModule],
      providers: [{provide: CalculationService, useClass: CalcService}, FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    calcService = TestBed.inject(CalculationService);
  });

  it('should load constructor', () => {
    expect(component).toBeTruthy();
  });
  it('should validate form',()=>{
    component.mortgageCalculatorForm.controls['principleAmt'].setValue("");
    component.mortgageCalculatorForm.controls['interestRate'].setValue("");
    component.mortgageCalculatorForm.controls['amortizationYrs'].setValue("");
    component.mortgageCalculatorForm.controls['pymtFrequency'].setValue("");
    component.mortgageCalculatorForm.controls['term'].setValue("");
    expect(component.mortgageCalculatorForm.valid).toBeFalsy();
  });
  it('should validate Mortgage Amount field', () => {
    const principleAmt = component.mortgageCalculatorForm.controls.principleAmt;
    expect(principleAmt.valid).toBeFalsy();
    principleAmt.setValue('');
    expect(principleAmt.hasError('required')).toBeTruthy();
  });
  it('should validate Interest Rate field', () => {
    const interestRate = component.mortgageCalculatorForm.controls.interestRate;
    expect(interestRate.valid).toBeFalsy();
    interestRate.setValue('');
    expect(interestRate.hasError('required')).toBeTruthy();
  });
  it('should validate Amortization Years field', () => {
    const amortizationYrs = component.mortgageCalculatorForm.controls.amortizationYrs;
    expect(amortizationYrs.valid).toBeFalsy();
    amortizationYrs.setValue('');
    expect(amortizationYrs.hasError('required')).toBeTruthy();
  });
  it('should validate Payment Frequency field', () => {
    const pymtFrequency = component.mortgageCalculatorForm.controls.pymtFrequency;
    expect(pymtFrequency.valid).toBeFalsy();
    pymtFrequency.setValue('');
    expect(pymtFrequency.hasError('required')).toBeTruthy();
  });
  it('should validate Term field', () => {
    const term = component.mortgageCalculatorForm.controls.term;
    expect(term.valid).toBeFalsy();
    term.setValue('');
    expect(term.hasError('required')).toBeTruthy();
  });
  it('should calculate mortgage', () => {
    component.mortgageCalculatorForm.controls['principleAmt'].setValue("100000");
    component.mortgageCalculatorForm.controls['interestRate'].setValue("6");
    component.mortgageCalculatorForm.controls['amortizationYrs'].setValue("10");
    component.mortgageCalculatorForm.controls['amortizationMonths'].setValue("1");
    component.mortgageCalculatorForm.controls['pymtFrequency'].setValue("12");
    component.mortgageCalculatorForm.controls['term'].setValue("2");
    
    component.calculateMortgage();
    expect(component.calculateMortgage).toBeTruthy();
  });
  it('should generate number sequence', () => {
    expect(component.numSequence(3)).toEqual([1,2,3]);
  });
});
