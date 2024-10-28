import { Component, OnInit } from '@angular/core';
import { HomeInternalService } from '../../services/common-services/home-internal.service';

import { Subscription } from 'rxjs';
import { ProductInternalService } from '../../services/common-services/product-internal.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-explorepage',
  templateUrl: './explorepage.component.html',
  styleUrls: ['./explorepage.component.css']
})
export class ExplorepageComponent implements OnInit {

  isAffliate: boolean = false;
  isReferral: boolean = false;
  isFaqPage: boolean = false;
  // isTestPage : boolean = false;

  //This click event subcription will receive event message / trigger when "check out" clicked at the header component
  clickEventsubscription_CallProductCheckOutAddressDetails: Subscription;

  constructor(public homeInternal: HomeInternalService,
    public productInternal: ProductInternalService,
    private router: Router) {


    //This will restrict only Cart Check-Out Navigation to Payment CheckOut Page
    this.productInternal.varPaymentPageNavProtectVal = 0;

    this.clickEventsubscription_CallProductCheckOutAddressDetails =
      this.productInternal
        .getClickEvent_CallProductCheckOutAddressDetails()
        .subscribe(() => {
          this.OpenChildForProductCheckOut();
        });
  }

  ngOnInit(): void {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    let currentUrlParam: string = "All";


    let currentUrl: string = window.location.href;
    let currentParam: string[] = currentUrl.split("?");

    let currentCategoryId: number = 0;

    if (currentParam[1] != undefined && currentParam[1].trim().length > 0) {
      let categoryParamData: string[] = currentParam[1].split("&&");
      let currentCategory = categoryParamData.filter(p => p.split("=")[0].toUpperCase() == "SECTION");

      if (currentCategory.length > 0) {
        currentUrlParam = currentCategory[0].split("=")[1];
      }
      currentCategoryId = this.homeInternal.uriExplorePageListingEnum.filter(p => p.Name.toUpperCase() == currentUrlParam.toUpperCase())[0]?.Id ?? 0;
    }

    if (currentCategoryId == 0) // Affliate Page
    {
      this.isAffliate = true;
      this.isReferral = false;
      this.isFaqPage = false;
      // this.isTestPage = false;
    }
    if (currentCategoryId == 1) // Referal Page
    {
      this.isAffliate = false;
      this.isReferral = true;
      this.isFaqPage = false;
      // this.isTestPage = false;
    }
    if (currentCategoryId == 2) // FAQ Page
    {
      this.isAffliate = false;
      this.isReferral = false;
      this.isFaqPage = true;
      // this.isTestPage = false;
    }
    if (currentCategoryId == 3) // Test Page
    {
      // this.isAffliate = false;
      // this.isReferral = false;
      // this.isFaqPage = false;
      // this.isTestPage = true;
      window.location.href = "/test";
    }
  }

  OpenChildForProductCheckOut() {
    if (!this.productInternal.varIsPaymentPageShowUsingChildComponent) {
      this.router.navigate(['payment/checkout']);
    }
  }

}
