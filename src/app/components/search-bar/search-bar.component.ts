import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith, filter } from 'rxjs';
import { City } from 'src/app/interfaces/city';
import { FuelType } from 'src/app/enums/fuelType';
import { CityService } from 'src/app/services/city.service';
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
  @ViewChild('searchField') searchField: ElementRef;

  constructor(private _cityService: CityService, private _priceSearchResultService: PriceSearchResultService) { 
    _cityService.getAllCities().then((cityList) => {
      this.options = cityList;
      this.optionsLoaded = true;
    });
    _priceSearchResultService.onLocationSearchAddress().subscribe((address) => {
      this.city.setValue(address);
      this.searchField.nativeElement.blur();
    });
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
    if(typeof(subject) == 'string') {
      return subject;
    }
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
      this._priceSearchResultService.searchByAddress(this.selectedCity, this.selectedFuelType);
      // fix no close on Search button
      setTimeout(() => {
        this.autocomplete.closePanel();
        this.searchField.nativeElement.blur();
      },100);
    }
  }

  onSearchByLocation() {
    this._priceSearchResultService.searchByLocation(this.selectedFuelType);
  }

}
