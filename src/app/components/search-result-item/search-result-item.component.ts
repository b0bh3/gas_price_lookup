import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FuelType } from 'src/app/enums/fuelType';
import { PriceSearchResult } from 'src/app/models/price-search-result.model';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css']
})
export class SearchResultItemComponent implements OnInit {
  name?: string;
  distance?: string;
  address?: string;
  dieselPrice?: string;
  superPrice?: string;
  gasPrice?: string;

  @Input() set priceSearchResult(priceSearchResult: PriceSearchResult) {
    this.name = priceSearchResult.getName();
    this.distance = priceSearchResult.getDistanceAsString();
    this.address = priceSearchResult.getAddressAsString();
    this.dieselPrice = priceSearchResult.getPriceAsString(FuelType.DIESEL);
    this.superPrice = priceSearchResult.getPriceAsString(FuelType.SUPER);
    this.gasPrice = priceSearchResult.getPriceAsString(FuelType.GAS);
  }

  @ViewChild('fuelprice') fuelPrice: ElementRef;
  @Input() fuelType: FuelType;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.fuelPrice.nativeElement.childNodes.forEach((childNode) => {
      if(!childNode.classList.contains(this.fuelType.toLowerCase())) {
        childNode.classList.add('hide-on-mobile');
      }
    });
  }

}
