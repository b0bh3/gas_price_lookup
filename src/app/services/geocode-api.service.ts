import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeocodeAPIService {
  API_LINK = 'https://geocode.maps.co/search?q=';

  constructor() { }

  async addressToCoordinates(address: string): Promise<GeolocationCoordinates> {
    const result = await fetch(this.API_LINK + address);
    const data = await result.json();
    // console.log(data);
    let coordinates: GeolocationCoordinates;

    await Promise.all(data).then(data => {
      coordinates = {
        latitude: data[0].lat,
        longitude: data[0].lon
      } as GeolocationCoordinates
    });

    return coordinates;
  }
}
