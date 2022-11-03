import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalculationService } from '../services/calculation.service';

interface MortgageTable {
  category: string;
  term: number;
  amortization: number;
}

const mortgageTableData: MortgageTable[] = [
  {category: 'Number of Payments', term: 0, amortization: 0},
  {category: 'Mortgage Payment', term: 0, amortization: 0},
  {category: 'Prepayment', term: 0, amortization: 0},
  {category: 'Principal Payments', term: 0, amortization: 0},
  {category: 'Interest Payments', term: 0, amortization: 0},
  {category: 'Total Cost', term: 0, amortization: 0}
];

@Component({
  selector: 'app-mortgage-calculator',
  templateUrl: './mortgage-calculator.component.html',
  styleUrls: ['./mortgage-calculator.component.scss']
})

export class MortgageCalculatorComponent {
  mortgageCalculatorForm: FormGroup;

  dataSource:MortgageTable[] = [];
  emiList:any = [];

  displayedColumns: string[] = ['category', 'term', 'amortization'];
  displayedColumnsEMI: string[] = ['installmentId', 'startingBalance', 'monthlyEmi', 'monthlyInterest', 'monthlyPrinciple', 'endingBalance', 'totalInterest'];
  
  tenureMonths: number = 0;
  termMonths: number = 0;

  pymtFrequencyMapping = new Map();
  addParams:any = {};

  constructor(private fb: FormBuilder, private calcService: CalculationService) {
    this.mortgageCalculatorForm = this.fb.group({
      principleAmt: ['',[Validators.required]],
      interestRate: ['',Validators.required],
      amortizationYrs: ['',Validators.required],
      amortizationMonths: [],
      pymtFrequency: ['',Validators.required],
      term: ['',Validators.required],
      prepymtAmt: [],
      prepymtFreq: [],
      startWith: []
    });
  
    this.pymtFrequencyMapping.set("52","Weekly")
    .set("26","Bi-weekly (every 2 weeks)")
    .set("24","Semi-monthly (24x per year)")
    .set("12","Monthly (12x per year)");
  }

  calculateMortgage(){
    let calculationData = this.mortgageCalculatorForm.value;

    let pymtFrequency = calculationData.pymtFrequency;
    let interest = this.calcService.formatDecimal(calculationData.interestRate / (pymtFrequency * 100) , 4);
    this.tenureMonths = (calculationData.amortizationYrs * pymtFrequency) + calculationData.amortizationMonths;
    this.termMonths = calculationData.term * pymtFrequency;

    this.emiList = this.calcService.calcEmiData(interest, this.tenureMonths, calculationData.principleAmt,this.termMonths);
    this.addParams = this.calcService.additionalParams;

    mortgageTableData.forEach((x,index)=>{
      switch(index){
        case 0: 
          x.amortization = this.tenureMonths;
          x.term = this.termMonths;
          break;
        case 1:
          x.amortization = this.addParams.monthlyEmi;
          x.term = this.addParams.monthlyEmi;
          break;
        case 2:
          x.amortization = 0;
          x.term = 0;
          break;
        case 3:
          x.amortization = this.addParams.totalPrinciple;
          x.term = this.addParams.termTotalPrinciple;
          break;
        case 4:
          x.amortization = this.addParams.totalInterest;
          x.term = this.addParams.termTotalInterest;
          break;
        case 5:
          x.amortization = this.addParams.totalCost;
          x.term = this.addParams.termTotalCost;
          break;
      }
    })
    this.dataSource = mortgageTableData;
  }
  numSequence(n: number): Array<number> {
    return [...Array(n+1).keys()].slice(1);
  }
}
