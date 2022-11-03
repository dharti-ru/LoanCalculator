import { TestBed } from '@angular/core/testing';

import { CalculationService } from './calculation.service';
import { emiData } from '../shared/mock';

describe('CalculationService', () => {
  let service: CalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should calculate monthly emi', () => {
    expect(service.PMT).toBeTruthy();
  });
  it('should calculate mortgage', () => {
    expect(service.calcEmiData(0.005, 12, 100000, 12)).toEqual(emiData);
  });
  it('should set additional content parameters', () => {
    expect(service.additionalParams).toBeTruthy();
  });
  it('should format number to precise floating value', () => {
    expect(service.formatDecimal(3.124563,2)).toEqual(3.12);
    expect(service.formatDecimal(6.1000000013,4)).toEqual(6.1000);
  });
});
