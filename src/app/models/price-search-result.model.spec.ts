import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GasStation } from '../interfaces/gas-station';
import { PriceSearchResult } from './price-search-result.model';

describe('PriceSearchResult', () => {
  let psr: PriceSearchResult;

  beforeEach(() => {
    psr = new PriceSearchResult(
      {} as GasStation
      );

});

  it('removes address from name', () => {
    expect(
      psr._removeAddressFromName(
        'JET - Grazer Straße 32', 
        'Grazer Strasse 32', 
        'Deutschlandsberg'
    )).toBe('JET');

    expect(
      psr._removeAddressFromName(
        'JET - Deutschlandsberg Grazer Straße 32', 
        'Grazer Strasse 32', 
        'Deutschlandsberg'
    )).toBe('JET');

    expect(
      psr._removeAddressFromName(
        'OMV - Grazer Strasse 32', 
        'Grazer Straße 32', 
        'Graz'
    )).toBe('OMV');

    expect(
      psr._removeAddressFromName(
        'ENI Deutschlandsberg', 
        'Grazer Strasse 32', 
        'Deutschlandsberg'
    )).toBe('ENI');
  })

  it('all caps to first letter upperCase', () => {
    expect(
      psr._capsToFirstLetterUpperCase(
        'GRAZER STRASSE 45'
      )
    ).toBe('Grazer Strasse 45');

    expect(
      psr._capsToFirstLetterUpperCase(
        'DEUTSCHLANDSBERG'
      )
    ).toBe('Deutschlandsberg');

    expect(
      psr._capsToFirstLetterUpperCase(
        'EICHENWEG 123'
      )
    ).toBe('Eichenweg 123');
  })
});
