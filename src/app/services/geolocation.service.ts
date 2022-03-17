import { Injectable } from '@angular/core';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  async getDeviceLocation() {

    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }
  
}
