import { Component, OnInit } from '@angular/core';
import { PriceSearchResultService } from 'src/app/services/price-search-result.service';
import { Subscription } from 'rxjs';
import { PriceSearchResult } from 'src/app/models/price-search-result.model';
import { Message } from 'src/app/interfaces/message';
import { FuelType } from 'src/app/enums/fuelType';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit {
  cheapestGasStations?: PriceSearchResult[];
  closestGasStations?: PriceSearchResult[];

  priceSearchResultSupscription: Subscription;
  searchResultMessageSubscription: Subscription;
  msg?: Message;
  fuelType?: FuelType;


  constructor(private _priceSearchResultService: PriceSearchResultService) { 
    this.priceSearchResultSupscription = _priceSearchResultService.onPriceSearchResults().subscribe((newPriceSearchResults) => {
      this.cheapestGasStations = newPriceSearchResults[0];
      this.closestGasStations = newPriceSearchResults[1];
      this.fuelType = _priceSearchResultService.getCurrentFuelType();
    });
    this.searchResultMessageSubscription = _priceSearchResultService.onSearchResultMessage().subscribe((newMessage) => {
      this.msg = newMessage;
    })
  }

  ngOnInit(): void {
  }

}
