import { FuelType } from "../enums/fuelType";
import { GasStation } from "../interfaces/gas-station";

export class PriceSearchResult {
    private gasStation: GasStation;

    constructor(gasStation: GasStation) {
        this.gasStation = gasStation;
    }

    getID(): number {
        return this.gasStation.id;
    }

    getAddressAsString(): string {
        let address: string = this.gasStation.location.address;
        let city: string = this.gasStation.location.city;

        // correct for CAPS addresses
        if(this.gasStation.location.address == this.gasStation.location.address.toUpperCase()) {
            address = this._capsToFirstLetterUpperCase(address);
        }
        
        // correct for CAPS city names
        if(this.gasStation.location.city == this.gasStation.location.city.toUpperCase()) {
            city = this._capsToFirstLetterUpperCase(city);
        }

        return `${address}, ${this.gasStation.location.postalCode} ${city}`;
    }

    getDistance(): number {
        return this.gasStation.distance;
    }

    getDistanceAsString(): string {
        return `${this.gasStation.distance.toFixed(1)} km`;
    }

    getName(): string {
        let name = this.gasStation.name;

        // remove address from name
        if(name.toLowerCase().replace('ß','ss').includes(this.gasStation.location.address.toLowerCase().replace('ß','ss'))) {
            name = this._removeAddressFromName(name, this.gasStation.location.address, this.gasStation.location.city);
        }

        return name;
    }

    getPriceAsString(fuelType: FuelType): string {
        const price = this.gasStation.prices.filter(price => price.fuelType == fuelType);
        return price.length == 1 ? `${price[0].amount.toFixed(3)}` : '- - - - -';
    }

    _capsToFirstLetterUpperCase(capsStr: string): string {
        const strArray = capsStr.split(' ');
        const wordArray = strArray.filter(str => str != strArray[strArray.length-1] || str == strArray[0]).map(str => { 
            return str[0] + str.slice(1, str.length).toLowerCase(); 
        });

        const result = strArray.length > 1 ? wordArray.toString().replace(',', ' ') + ' ' + strArray[strArray.length-1] : wordArray.toString();

        return result;
    }

    _removeAddressFromName(name: string, address: string, city: string): string {
        let newName: string;
        let endOfName: number;

        endOfName = name
            .toLowerCase()
            .replace('ß', 'ss')
            .replace( address
                .toLowerCase()
                .replace('ß','ss')
            , '')
            .replace( city
                .toLowerCase()
                .replace('ß', 'ss')
            , '')
            .replace('-','')
            .trimEnd()
            .length;
        
        newName = name.slice(0, endOfName);

        return newName;
    }
}
