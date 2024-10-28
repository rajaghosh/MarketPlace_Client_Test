import { Component, OnInit } from '@angular/core';
import { ProductInternalService } from '../../services/common-services/product-internal.service';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  isPaymentPageIssue: boolean = false;
  isOtherPageIssue: boolean = true;

  //This click event subcription will receive event message / trigger when "check out" clicked at the header component
  clickEventsubscription_CallProductCheckOutAddressDetails: Subscription;

  constructor(public productInternal: ProductInternalService) {

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
    let currentUrlParam: string = "All";


    let currentUrl: string = window.location.href;
    //let currentParam: string[] = currentUrl.split("/");

    let currentCategoryId: number = 0;

    // debugger;

    //Category Search
    if (currentUrl != undefined && currentUrl.length > 0) {
      if (currentUrl.toUpperCase().includes("PAYMENT")) {
        this.isPaymentPageIssue = true;
        this.isOtherPageIssue = false;
      }
    }
  }

  OpenChildForProductCheckOut() {
    if (!this.productInternal.varIsPaymentPageShowUsingChildComponent) {
      window.location.href = 'payment/checkout';
    }
  }
}

