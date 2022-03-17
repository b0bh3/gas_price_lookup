import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith, filter } from 'rxjs';
import { City } from 'src/app/interfaces/city';
import { FuelType } from 'src/app/enums/fuelType';
import { CityService } from 'src/app/services/city.service';
import { FuelPriceAPIService } from 'src/app/services/fuel-price-api.service';
import { GeocodeAPIService } from 'src/app/services/geocode-api.service';
import { PriceSearchResultService } from 'src/app/services/price-search-result.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  city = new FormControl();
  fuelType = new FormControl();
  options: City[];
  optionsLoaded = false;
  filteredOptions: Observable<City[]>;
  selectedFuelType = FuelType.SUPER;
  selectedCity: City;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  constructor(private _cityService: CityService, private _fuelPriceApiService: FuelPriceAPIService, private _geocodeAPIService: GeocodeAPIService, private _priceSearchResultService: PriceSearchResultService) { 
    _cityService.getAllCities().then((cityList) => {
      this.options = cityList;
      this.optionsLoaded = true;
    })
  }

  ngOnInit(): void {
    this.filteredOptions = this.city.valueChanges.pipe(
      startWith(''),
      map(value => typeof(value) == 'string' ? this._filter(value) : this._filter(this.toString(value)))
    );
    this.fuelType.valueChanges.subscribe(value => {
      this.selectedFuelType = value;
      if(this.selectedCity != null) {
        this.onSearchByAddress();
      }
    });
    this.city.valueChanges.subscribe(value => {
        this.selectedCity = value;
    });
  }

  displayFn(subject): string {
    return subject ? `${subject.zip} ${subject.name}` : undefined;
  }

  private _filter(value: string) {
    // console.log(value);
    const filterValue = value.toLowerCase();
    return this.optionsLoaded ? this.options.filter(option => this.toString(option).toLowerCase().includes(filterValue)): null;
  }

  toString(city: City): string {
    return `${city.zip} ${city.name}`;
  }

  onSearchByAddress() {
    if(this.selectedCity != null) {
      this.autocomplete.closePanel();
      this._priceSearchResultService.searchByAddress(this.selectedCity, this.selectedFuelType);
    }
  }

  onSearchByLocation() {
    this._priceSearchResultService.searchByLocation(this.selectedFuelType);
  }

}
