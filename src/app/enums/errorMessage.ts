import { Message } from "../interfaces/message";

export enum ErrorMessage {
    AddressNotFound = 'Der angegebene Ort konnte nicht gefunden werden. Versuchen sie weniger spezifisch zu sein oder wählen sie die Standort Funktion.',
    MidDayBlackout = 'Zwischen 12:00 und 12:10 Uhr stehen für Tankstellen keine Preise zur Verfügung. Aufgrund der gesetzlichen Bestimmungen werden in dieser Zeit die meisten Preise gemeldet. Ein Preisvergleich wäre daher nicht sinnvoll.',
    GeolocationDenied = 'Standort konnte nicht abgerufen werden, da die Anfrage abgelehnt wurde. Suchen Sie den gewünschten Ort über die Suchleiste.',
    GeolocationError = 'Standort konnte nicht abgerufen werden. Suchen Sie den gewünschten Ort über die Suchleiste.'
}