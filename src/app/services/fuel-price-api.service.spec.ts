import { TestBed } from '@angular/core/testing';

import { FuelPriceAPIService } from './fuel-price-api.service';

describe('FuelPriceAPIService', () => {
  let service: FuelPriceAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuelPriceAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
