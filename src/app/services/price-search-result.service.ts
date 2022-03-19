import { Injectable } from '@angular/core';
import { PriceSearchResult } from '../models/price-search-result.model';
import { Observable, Subject } from 'rxjs';
import { GasStation } from '../interfaces/gas-station';
import { Message } from '../interfaces/message';
import { City } from '../interfaces/city';
import { FuelType } from '../enums/fuelType';
import { FuelPriceAPIService } from './fuel-price-api.service';
import { ErrorMessage } from '../enums/errorMessage';
import { GeolocationService } from './geolocation.service';
import { GeocodeAPIService } from './geocode-api.service';

@Injectable({
  providedIn: 'root'
})
export class PriceSearchResultService {
  private _cheapestGasStations: PriceSearchResult[];
  private _closestGasStations: PriceSearchResult[];

  private _priceSearchResultsSubject = new Subject<PriceSearchResult[][]>();
  private _searchResultMessageSubject = new Subject<Message>();
  private _locationSearchAddressSubject = new Subject<String>();

  private currentFuelType: FuelType;

  constructor(private _fuelPriceAPIService: FuelPriceAPIService, private _geolocationService: GeolocationService, private _geocodeAPIService: GeocodeAPIService) { }

  setPriceSearchResults(newPriceSearchResults: PriceSearchResult[]): void {
    this._cheapestGasStations = newPriceSearchResults.slice(0, 5);
    
    this._closestGasStations = newPriceSearchResults.slice(5, newPriceSearchResults.length);
    this._closestGasStations.sort((a, b) => a.getDistance() - b.getDistance());

    this._priceSearchResultsSubject.next([ this._cheapestGasStations, this._closestGasStations ]);
  }

  onPriceSearchResults(): Observable<PriceSearchResult[][]> {
    return this._priceSearchResultsSubject.asObservable();
  }

  setSearchResultMessage(message: Message): void {
    this._searchResultMessageSubject.next(message);
  }

  onSearchResultMessage(): Observable<Message> {
    return this._searchResultMessageSubject.asObservable();
  }

  onLocationSearchAddress(): Observable<String> {
    return this._locationSearchAddressSubject.asObservable();
  }

  setLocationSearchAddress(address: string) {
    this._locationSearchAddressSubject.next(address);
  }

  getCurrentFuelType(): FuelType {
    return this.currentFuelType;
  }

  searchByAddress(city: City, fuelType: FuelType): void {
    // check if City has been selected or searching by string
    let address = city.name != undefined && city.zip != undefined ? `${city.zip} ${city.name}` : `${city}`;

    this._fuelPriceAPIService.searchByAddress(
      address, fuelType
    )
    .then(result => {
      // Array of Prices
      if(result instanceof Array) {
        this.currentFuelType = fuelType;
        this.setPriceSearchResults(result)
        this.setSearchResultMessage(null);
      }
      // Message
      else {
        this.setSearchResultMessage(result);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  searchByLocation(fuelType: FuelType) {
    this._geolocationService.getDeviceLocation()
    .then((position: GeolocationPosition) => {
      this._fuelPriceAPIService.searchByAddress(position.coords, fuelType)
      .then(result => {
        // Array of Prices
        if(result instanceof Array) {
          this.currentFuelType = fuelType;
          this.setPriceSearchResults(result)
          this.setSearchResultMessage(null);
        }
        // Message
        else {
          this.setSearchResultMessage(result);
        }
      });
      this._geocodeAPIService.coordinatesToAddress(position.coords).then(result => {
        if(typeof(result) == 'string') {
          this.setLocationSearchAddress(result);
        }
        else {
          console.log(result);
        }
      });
    })
    .catch((error: GeolocationPositionError) => {
      let message: ErrorMessage;
      switch(error.code) {
        case 1: 
          message = ErrorMessage.GeolocationDenied;
          break;
        default:
          message = ErrorMessage.GeolocationError;
          break;
      }
      this.setSearchResultMessage(
        {
          title: "Error",
          content: `${message}`
        } as Message 
      );
    });
  }
}
