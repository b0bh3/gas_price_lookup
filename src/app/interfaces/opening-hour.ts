import { Day } from "../enums/day";

export interface OpeningHours {
    day: Day;
    from: string;
    to: string;
}