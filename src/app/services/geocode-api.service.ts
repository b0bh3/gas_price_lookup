import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ErrorMessage } from '../enums/errorMessage';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class GeocodeAPIService {
  API_LINK = 'https://geocode.maps.co/search?';

  constructor() { }

  async addressToCoordinates(address: string): Promise<GeolocationCoordinates | Message> {
    try {
      let params = new URLSearchParams();
      params.append('q', address);

      const result = await fetch(this.API_LINK + params.toString());
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
}
