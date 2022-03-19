import { Injectable } from '@angular/core';
import { City } from '../interfaces/city';
import { FuelPriceAPIService } from './fuel-price-api.service';
@Injectable({
  providedIn: 'root'
})
export class CityService {
  RES_CITIES = './assets/cities.json';

  private _cityList: Array<City>;

  constructor(private _fuelPriceAPIService: FuelPriceAPIService) { }

  private async _buildCityList(cityData: Promise<Map<number,string>>): Promise<City[]> {

    const regionList = await this._fuelPriceAPIService.getRegions();
    const cities = await cityData;

    this._cityList = regionList.map(region => {
      return region.zips.map(zip => {
          return {
            zip: zip,
            name: cities.get(zip) == undefined ? region.name : cities.get(zip),
            districtCode: region.code
          } as City
      }) as Array<City>
    })
    .flat()
    .filter(city => city.name != undefined || city.zip-1000 < 1000)
    .sort((a, b) => {return a.zip-b.zip});

    return this._cityList;
  }

  private async _loadCities(): Promise<Map<number,string>> {
    
    const response = await fetch(this.RES_CITIES);
    const cities_raw = await response.json();
    
    const cities = new Map<number, string>(cities_raw.map(city => {
      return [city.PLZ, city.Gemeindename];
    }));
    
    return await cities;
  }

  async getAllCities(): Promise<Array<City>> {
    return await this._buildCityList(this._loadCities());
  }
}
