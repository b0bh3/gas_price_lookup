import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ErrorMessage } from '../enums/errorMessage';
import { City } from '../interfaces/city';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class GeocodeAPIService {
  private API_LINK = 'https://geocode.maps.co';
  private API_ADDRESS_TO_COORDS = '/search?'
  private API_COORDS_TO_ADDRESS = '/reverse?';

  constructor() { }

  async addressToCoordinates(address: string): Promise<GeolocationCoordinates | Message> {
    try {
      let params = new URLSearchParams();
      params.append('q', address);

      const result = await fetch(this.API_LINK + this.API_ADDRESS_TO_COORDS + params.toString());
      const data = await result.json();

      const locations = await data.filter(location =>
        location.display_name.includes('Österreich')
      );
      
      // console.log(data);
      // console.log(locations);

      // check for results
      if(locations.length == 0) {
        return {
          title: "Error",
          content: ErrorMessage.AddressNotFound
        } as Message
      }

      let coordinates: GeolocationCoordinates;

      await Promise.all(locations).then(location => {
        coordinates = {
          latitude: location[0].lat,
          longitude: location[0].lon
        } as GeolocationCoordinates
      });

      return coordinates;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

  async coordinatesToAddress(coords: GeolocationCoordinates): Promise<string | Message> {
    try {
      let params = new URLSearchParams();
      params.append('lat', `${coords.latitude}`);
      params.append('lon', `${coords.longitude}`);

      const result = await fetch(this.API_LINK + this.API_COORDS_TO_ADDRESS + params.toString());
      const data = await result.json();
      // console.log(data);

      // check for results
      if(!data.hasOwnProperty('address')) {
        return {
          title: "Error",
          content: data.error
        } as Message
      }

      let address: string = `${data.address.road} ${data.address.house_number}, ${data.address.postcode} ${data.address.city}`;

      return address;
    } 
    catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }
}
