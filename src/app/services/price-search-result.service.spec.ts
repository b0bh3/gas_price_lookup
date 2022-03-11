import { TestBed } from '@angular/core/testing';

import { PriceSearchResultService } from './price-search-result.service';

describe('PriceSearchResultService', () => {
  let service: PriceSearchResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceSearchResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
