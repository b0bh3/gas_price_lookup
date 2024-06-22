import { Injectable } from '@angular/core';
import { City } from '../interfaces/city';
import { FuelType } from 'src/app/enums/fuelType';
import { Region } from 'src/app/interfaces/region';
import { GeocodeAPIService } from './geocode-api.service';
import { PriceSearchResult } from '../models/price-search-result.model';
import { Contact } from '../interfaces/contact';
import { Location } from '../interfaces/location';
import { OfferInformation } from '../interfaces/offer-information';
import { OpeningHours } from '../interfaces/opening-hour';
import { PaymentArrangements } from '../interfaces/payment-arrangements';
import { PaymentMethods } from '../interfaces/payment-methods';
import { GasStation } from '../interfaces/gas-station';
import { Price } from '../interfaces/Price';
import { PriceSearchResultService } from './price-search-result.service';
import { Message } from '../interfaces/message';
import { ErrorMessage } from '../enums/errorMessage';

@Injectable({
  providedIn: 'root'
})
export class FuelPriceAPIService {
  private API_LINK = 'https://api.e-control.at/sprit/1.0';
  private API_REGIONS = '/regions';
  private API_SEARCH_BY_REGION = '/search/gas-stations/by-region';
  private API_SEARCH_BY_ADDRESS = '/search/gas-stations/by-address';

  constructor(private _geocodeAPIService: GeocodeAPIService) { }

  async getRegions(): Promise<Array<Region>> {

    const response = await fetch(this.API_LINK + this.API_REGIONS);
    const data = await response.json();

    let regionList = await data.flatMap(region => {
      return [
        // subRegions => Bezirke
        region.subRegions.map(subRegion => {
          const { code, type, name, postalCodes } = subRegion;
          return ({
            code: code,
            type: type,
            name: name,
            zips: postalCodes?.map(zip => {return (+zip)})
          } as Region);
        })
      ].flat();
    })
    .filter(region => region.zips != null);

    return await regionList;
  }

  async searchByRegion(city: City, fuelType: FuelType) {

    let params = new URLSearchParams();
    params.append('code', `${city.districtCode}`);
    params.append('type', 'PB');
    params.append('fuelType', fuelType);

    const response = await fetch(this.API_LINK + this.API_SEARCH_BY_REGION + '?' + params.toString());
    const data = await response.json();

    console.log(data);
  }

  async searchByAddress(address: string | GeolocationCoordinates, fuelType: FuelType): Promise<PriceSearchResult[] | Message>  {
    try {
      // console.log(address);
      const date = new Date();

      if(date.getHours() == 12 && date.getMinutes() >= 0 && date. getMinutes() <= 10) {
        return (
          {
            title: 'Info',
            content: ErrorMessage.MidDayBlackout
          } as Message
        );
      }

      let coordinates;

      // check if address is string or coordinates
      if(typeof(address) == 'string') {

        coordinates = await this._geocodeAPIService.addressToCoordinates(address);

        // Message
        if(coordinates.hasOwnProperty('title') && coordinates.hasOwnProperty('content')) {
          return coordinates as Message;
        }
        // Coordinates
        else {
          coordinates = coordinates as GeolocationCoordinates;
        }
      } 
      else {
        coordinates = address;
      }

      let params = new URLSearchParams();
      params.append('latitude', coordinates.latitude+'');
      params.append('longitude', coordinates.longitude+'');
      params.append('fuelType', fuelType);

      const response = await fetch(this.API_LINK+this.API_SEARCH_BY_ADDRESS + '?' + params.toString());
      const data = await response.json();
      
      // Also request all all other fuel types for additional info to display
      const otherFuelTypes = Object.values(FuelType).filter(type => type != fuelType);

      params.set('fuelType', otherFuelTypes[0]);
      const response2 = await fetch(this.API_LINK + this.API_SEARCH_BY_ADDRESS + '?' + params.toString());
      const data2 = await response2.json();

      params.set('fuelType', otherFuelTypes[1]);
      const response3 = await fetch(this.API_LINK + this.API_SEARCH_BY_ADDRESS + '?' + params.toString());
      const data3 = await response3.json();

      const priceSearchResults = data.map(data => {
        const { contact, distance, id, location, name, offerInformation, open, openingHours, otherServiceOffers, paymentArrangements, paymentMethods, position, prices } = data;
        return new PriceSearchResult( {
          contact: {  ...contact } as Contact,
          distance: distance,
          id: id,
          location: { ...location } as Location,
          name: name,
          offerInformation: { ...offerInformation } as OfferInformation,
          open: open,
          openingHours: openingHours.map(openingHours => {
            return { ...openingHours } as OpeningHours
          }),
          otherServiceOffers: otherServiceOffers,
          paymentArrangements: { ...paymentArrangements } as PaymentArrangements,
          paymentMethods: { ...paymentMethods } as PaymentMethods,
          position: position,
          prices: [
            { ...prices[0] } as Price,
            data2.filter(data2 => data2.id == id && !!data2.prices.length)?.map(data2 => {
              return { ...data2.prices[0] } as Price
            }),
            data3.filter(data3 => data3.id == id && !!data3.prices)?.map(data3 => {
              return { ...data3.prices[0] } as Price
            })
          ].flat()
        } as GasStation )
      });

      return priceSearchResults;
    } 
    catch(error) {
      throw new Error(`${error.message}`);
    }
  }

}
