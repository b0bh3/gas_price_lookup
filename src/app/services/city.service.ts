import { Injectable } from '@angular/core';
import { City } from '../interfaces/city';
import { FuelPriceAPIService } from './fuel-price-api.service';
@Injectable({
  providedIn: 'root'
})
export class CityService {
  RES_CITIES = '../../assets/cities.json';

  private _cityList: Array<City>;

  constructor(private _fuelPriceService: FuelPriceAPIService) { 
  }

  private async _buildCityList(cityData: Promise<Map<number,string>>): Promise<City[]> {
    
    await Promise.all([this._fuelPriceService.getRegions(), cityData]).then(values => {
      const regionList = values[0];
      // console.log(regionList);
      const cities = values[1];
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
      // this.cityList.forEach(city => console.log(`[${city.zip}] ${city.name}`));
      // console.log(this.cityList.length);
    });
    return this._cityList;

  }

  private async _loadCities(): Promise<Map<number,string>> {
    const response = await fetch(this.RES_CITIES);
    const cities_raw = await response.json();
    const cities = new Map<number, string>(cities_raw.map(city => {
      return [city.PLZ, city.Gemeindename];
    }));
    // console.log(cities);
    return await cities;
  }

  async getAllCities(): Promise<Array<City>> {
    return await this._buildCityList(this._loadCities());
  }
}
