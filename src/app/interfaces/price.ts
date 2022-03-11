import { FuelType } from "../enums/fuelType";

export interface Price {
    amount: number;
    fuelType: FuelType;
    label: string;
}