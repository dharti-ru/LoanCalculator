import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  additionalParams = {
    extraPayment: 0,
    extraInstallment: 0,
    monthlyEmi: 0,
    totalPrinciple: 0,
    termTotalPrinciple: 0,
    totalInterest: 0,
    termTotalInterest: 0,
    totalCost: 0,
    termTotalCost: 0,
    termEndingBalance: 0
  }
  constructor() { }
  PMT(ir:number, np:number, pv:number):number {
    // Calculate installment amount
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     */
    var pmt, pvif;
    if (ir === 0)
        return pv/np;

    pvif = Math.pow(1 + ir, np);
    pmt = ir * (pv * pvif) / (pvif - 1);

    return this.formatDecimal(pmt, 2);
  }
  calcEmiData(interestRate:number, months:number, principle:number,termMonths:number){
    // Calulcate and return each installment data along with total interest, principle etc. in an array
    let monthlyEmi = this.PMT(interestRate,months,principle);
    this.additionalParams.monthlyEmi = monthlyEmi;

    let startingBalance = principle;
    let totalInterest = 0;
    let totalPrinciple = 0;
    let installmentId = 0;
    let emiArr = [];

    while(startingBalance > 1) {
      installmentId++;
      let monthlyInterest = this.formatDecimal(startingBalance * interestRate , 2);
      if(startingBalance <= monthlyEmi){
        monthlyEmi = this.formatDecimal(startingBalance + monthlyInterest,2);
      }
      
      let monthlyPrinciple = this.formatDecimal(monthlyEmi - monthlyInterest , 2);

      let endingBalance = this.formatDecimal(startingBalance - monthlyPrinciple, 2);

      totalInterest += monthlyInterest;
      totalPrinciple += monthlyPrinciple;

      emiArr.push({
        totalInterest: this.formatDecimal(totalInterest,2),
        totalPrinciple: this.formatDecimal(totalPrinciple,2),
        startingBalance: startingBalance,
        monthlyEmi: monthlyEmi,
        monthlyInterest: monthlyInterest,
        monthlyPrinciple: monthlyPrinciple,
        endingBalance: endingBalance,
        installmentId: installmentId
      });
      startingBalance = endingBalance;
    }
    this.setAdditionalParams(emiArr,months,termMonths);
    return emiArr;
  }

  setAdditionalParams(emiArr:any,months:number,termMonths:any){
    // Set additional parameters required for plotting calculation table and mortgage summary
    if(emiArr.length >= months){
      this.additionalParams.extraInstallment = emiArr.length - months;
      for(let i = months; i < emiArr.length; i++){
        this.additionalParams.extraPayment += emiArr[i].monthlyPrinciple + emiArr[i].monthlyInterest;
      }
    }
    this.additionalParams.totalPrinciple = emiArr[emiArr.length - 1].totalPrinciple;
    this.additionalParams.termTotalPrinciple = emiArr[termMonths - 1].totalPrinciple;
    this.additionalParams.totalInterest = emiArr[emiArr.length - 1].totalInterest;
    this.additionalParams.termTotalInterest = emiArr[termMonths - 1].totalInterest;
    
    this.additionalParams.totalCost = (emiArr[emiArr.length - 1].totalInterest + emiArr[0].startingBalance);
    this.additionalParams.termTotalCost = emiArr[termMonths - 1].totalPrinciple + emiArr[termMonths - 1].totalInterest;

    this.additionalParams.termEndingBalance = emiArr[termMonths - 1].endingBalance;
  }

  formatDecimal(n:number,decimalPlace:number){
    // Format numbers to precised floating point values
    return parseFloat(parseFloat(n.toPrecision(10)).toFixed(decimalPlace));
  }
}