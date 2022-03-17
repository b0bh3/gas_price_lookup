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
  private API_LINK = 'https://api.e-control.at/sprit/1.0/';
  private API_REGIONS = 'regions';
  private API_SEARCH_BY_REGION = '/search/gas-stations/by-region';
  private API_SEARCH_BY_ADDRESS = '/search/gas-stations/by-address';

  constructor(private _geocodeAPIService: GeocodeAPIService) { }

  async getRegions(): Promise<Array<Region>> {
    const response = await fetch(this.API_LINK+this.API_REGIONS);
    const data = await response.json();

    let regionList = await data.flatMap(region => {
      // console.log(region);
      return [
        // // parent region aka "Bundesland"
        // {
        //   code: region.code,
        //   type: region.type,
        //   name: region.name
        // } as Region,
        // array of subRegions aka "Bezirke"
        region.subRegions.map(subRegion => {
          // console.log(subRegion);
          return ({
            code: subRegion.code,
            type: subRegion.type,
            name: subRegion.name,
            zips: subRegion.postalCodes?.map(zip => {return (+zip)})
          } as Region);
        })
      ].flat();
    });

    regionList = regionList.filter(region => region.zips != null);

    return await regionList;
  }

  async searchByRegion(city: City, fuelType: FuelType) {
    let params = new URLSearchParams();
    params.append('code', city.districtCode+'');
    params.append('type', 'PB');
    params.append('fuelType', fuelType);

    const response = await fetch(this.API_LINK+this.API_SEARCH_BY_REGION+ '?' + params.toString());
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

      if(typeof(address) == 'string') {
        coordinates = await this._geocodeAPIService.addressToCoordinates(address);
        // console.log(coordinates);

        // Message
        if(coordinates.hasOwnProperty('title') && coordinates.hasOwnProperty('content')) {
          return coordinates as Message;
        }
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
      
      let response2, response3, data2, data3;
      

      if(fuelType == FuelType.SUPER) {
        params.set('fuelType', FuelType.DIESEL);
        response2 = await fetch(this.API_LINK+this.API_SEARCH_BY_ADDRESS+ '?' + params.toString());
        data2 = await response2.json();
        params.set('fuelType', FuelType.GAS);
        response3 = await fetch(this.API_LINK+this.API_SEARCH_BY_ADDRESS+ '?' + params.toString());
        data3 = await response3.json();
      } 
      else if(fuelType == FuelType.DIESEL) {
        params.set('fuelType', FuelType.SUPER);
        response2 = await fetch(this.API_LINK+this.API_SEARCH_BY_ADDRESS+ '?' + params.toString());
        data2 = await response2.json();
        params.set('fuelType', FuelType.GAS);
        response3 = await fetch(this.API_LINK+this.API_SEARCH_BY_ADDRESS+ '?' + params.toString());
        data3 = await response3.json();
      } 
      else {
        params.set('fuelType', FuelType.DIESEL);
        response2 = await fetch(this.API_LINK+this.API_SEARCH_BY_ADDRESS+ '?' + params.toString());
        data2 = await response2.json();
        params.set('fuelType', FuelType.SUPER);
        response3 = await fetch(this.API_LINK+this.API_SEARCH_BY_ADDRESS+ '?' + params.toString());
        data3 = await response3.json();
      }

      // console.log(data);
      // console.log(data2);
      // console.log(data3);

      const priceSearchResults = data.map(data => {
        return new PriceSearchResult( {
          contact: {
            fax:  data.contact.fax,
            mail: data.contact.mail,
            telephone: data.contact.telephone,
            website: data.contact.website
          } as Contact,
          distance: data.distance,
          id: data.id,
          location: {
            address: data.location.address,
            city: data.location.city,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            postalCode: data.location.postalCode
          } as Location,
          name: data.name,
          offerInformation: {
            selfService: data.offerInformation.selfService,
            service: data.offerInformation.service,
            unattended: data.offerInformation.unattended
          } as OfferInformation,
          open: data.open,
          openingHours: data.openingHours.map(openingHours => {
            return {
              day: openingHours.day,
              from: openingHours.from,
              to: openingHours.to
            } as OpeningHours
          }),
          otherServiceOffers: data.otherServiceOffers,
          paymentArrangements: {
            accessMod: data.paymentArrangements.accessMod,
            clubCard: data.paymentArrangements.clubCard,
            clubCardText: data.paymentArrangements.clubCardText,
            cooperative: data. paymentArrangements.cooperative
          } as PaymentArrangements,
          paymentMethods: {
            cash: data.paymentMethods.cash,
            creditCard: data.paymentMethods.creditCard,
            debitCard: data.paymentMethods.debitCard,
            others: data.paymentMethods.others
          } as PaymentMethods,
          position: data.position,
          prices: [
            {
              amount: data.prices[0]?.amount,
              fuelType: data.prices[0]?.fuelType,
              label: data.prices[0]?.label
            } as Price,
            data2.filter(data2 => data2.id == data.id && data2.prices.length > 0)?.map(data2 => {
              return {
                amount: data2.prices[0].amount,
                fuelType: data2.prices[0].fuelType,
                label: data2.prices[0].label
              } as Price
            }),
            data3.filter(data3 => data3.id == data.id && data3.prices.length > 0)?.map(data3 => {
              return {
                amount: data3.prices[0].amount,
                fuelType: data3.prices[0].fuelType,
                label: data3.prices[0].label
              } as Price
            })
          ].flat()
        } as GasStation )
      });

      // console.log(priceSearchResults);

      return priceSearchResults;
    } catch(error) {
      throw new Error(`${error.message}`);
    }
  }

}
