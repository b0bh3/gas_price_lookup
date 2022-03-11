import { Contact } from "./contact";
import { Location } from "./location";
import { OfferInformation } from "./offer-information";
import { OpeningHours } from "./opening-hour";
import { PaymentArrangements } from "./payment-arrangements";
import { PaymentMethods } from "./payment-methods";
import { Price } from "./Price";

export interface GasStation {
    contact: Contact;
    distance: number;
    id: number;
    location: Location;
    name: string;
    offerInformation: OfferInformation;
    open: boolean;
    openingHours: OpeningHours[];
    otherServiceOffers: string;
    paymentArrangements: PaymentArrangements,
    paymentMethods: PaymentMethods,
    position: number;
    prices: Price[];
}