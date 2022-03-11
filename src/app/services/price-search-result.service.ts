import { Injectable } from '@angular/core';
import { PriceSearchResult } from '../models/price-search-result.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceSearchResultService {
  private _allPriceSearchResults: PriceSearchResult[];
  private _cheapestGasStations: PriceSearchResult[];
  private _closestGasStations: PriceSearchResult[];

  private _priceSearchResultsSubject = new Subject<PriceSearchResult[][]>();

  constructor() { }

  setPriceSearchResults(newPriceSearchResults: PriceSearchResult[]) {
    this._cheapestGasStations = newPriceSearchResults.slice(0, 5);

    this._closestGasStations = newPriceSearchResults.slice(5, newPriceSearchResults.length);

    this._allPriceSearchResults = newPriceSearchResults;
    this._priceSearchResultsSubject.next([ this._cheapestGasStations, this._closestGasStations ]);
  }

  onPriceSearchResults(): Observable<PriceSearchResult[][]> {
    return this._priceSearchResultsSubject.asObservable();
  }
}
