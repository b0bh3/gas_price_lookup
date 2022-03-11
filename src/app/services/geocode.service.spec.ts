import { TestBed } from '@angular/core/testing';

import { GeocodeAPIService } from './geocode-api.service';

describe('GeocodeService', () => {
  let service: GeocodeAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeocodeAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
