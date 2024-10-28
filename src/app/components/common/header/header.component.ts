import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCartModel, ProductColor, ProductSize, ProductSubscriptionModel } from '../../../../app/models/product.model';
import { SubscriptionModelAutoshipOtpResponse } from '../../../../app/models/subcription.model';
import { ProductInternalService } from '../../../../app/services/common-services/product-internal.service';
import { SubscriptionService } from '../../../../app/services/http-services/subscription.service';
import { CheckoutDetails } from '../../../models/checkout.model';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { ProductService } from 'src/app/services/http-services/product.service';
import { LinkForUi } from 'src/app/models/homepage.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductInternalOperationService } from 'src/app/services/common-services/product-internal-operation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() isCustomer: boolean = false;
  formGroupEmailToGetOtp: FormGroup = new FormGroup({});
  formGroupSubmitOtp: FormGroup = new FormGroup({});

  totalAmount: number = 0;

  isOtpMessage: boolean = false;
  isMakeEmailReadonly: boolean = false;
  otpReceived: string = "";
  emailMessage: string = "";
  isOtpMismatch: boolean = false;
  otpMismatchMessage: string = "";
  // isCheckOutButtonDisabled: boolean = false;
  urlLetAmericaLive: string = "";
  linksForUiList: LinkForUi[] = [];

  isMenuOpened: boolean = false;
  isAutoshipPage: boolean = false;

  isSupplementProductsSelected: boolean = false;
  supplementProductTotal: number = 0;

  affliateCodeReceived: string = "";

  element1: HTMLElement = {} as HTMLElement;

  constructor(public productInternal: ProductInternalService,
    private fBuilder: FormBuilder,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private productService: ProductService,
    public productInternalOperation: ProductInternalOperationService,
    private dialog: MatDialog) {

      this.MapAfcode();
  }

  ngOnInit(): void {

    this.formGroupEmailToGetOtp
      = this.fBuilder.group({
        EmailForOtp: new FormControl('', [Validators.required, Validators.email,]),

      });
    this.formGroupSubmitOtp
      = this.fBuilder.group({
        OtpReceived: new FormControl('', [Validators.required]),

      });


    //debugger;
    //Check if it is autoship page
    let currentUrl: string = window.location.href;
    if (currentUrl != undefined && currentUrl.trim().length > 0) {
      this.isAutoshipPage = (currentUrl.includes("autoship") || currentUrl.includes("payment/supplementproduct"));
      if (this.isAutoshipPage == true) {
        this.productInternalOperation.FunctionGetSupplementProductCartInLocalStorage();
      }
    }

    this.element1 = document.getElementById('CloseUnsubscribeAutoship') as HTMLElement;

    this.productInternal.FuncGetCartDataFromLocalStorage();

    this.CheckCartCount();


    this.isSupplementProductsSelected = (this.productInternalOperation.varSelectedSupplements.length == 3) ? true : false;
    this.productInternal.objCheckOutSupplementProductList
      .forEach(x => {
        this.supplementProductTotal = this.supplementProductTotal + x.SelectedProductPrice
      });



  }

  MapAfcode() {

    let currentUrl: string = window.location.href;
    let currentParam: string[] = currentUrl.split("?");

    //debugger;
    //As per new implementation if we have acode in our URL we will simply push it to localstorage
    // &&aCode
    if (currentParam[1] != undefined && currentParam[1].trim().length > 0) {
      if (currentParam[1].toUpperCase().includes("ACODE=")) {
        let categoryParamData: string[] = currentParam[1].split("&");

        var acodeData = categoryParamData.filter(p => p.toUpperCase().includes("ACODE=")).map(p => p);
        if (acodeData.length > 0) {
          let affliateCode = acodeData.filter(p => p.split("=")[0].toUpperCase() == "ACODE");

          if (affliateCode.length > 0) {
            this.affliateCodeReceived = affliateCode[0].split("=")[1];
            this.affliateCodeReceived = this.affliateCodeReceived; //this.DecodeAffliateLink(this.affliateCodeReceived);

            localStorage.setItem("userCheckVal", JSON.stringify(this.affliateCodeReceived));
          }
        }
      }


    }

  }


  GetOtp() {
    const email: string = this.formGroupEmailToGetOtp.value["EmailForOtp"];

    this.subscriptionService.getOtpAsync(email).subscribe(s => {

      let result: SubscriptionModelAutoshipOtpResponse = s.Data;
      console.log(result);
      if (s.Error == null) {
        if (result != null || result != undefined) {
          this.isOtpMessage = true;
          this.otpReceived = result.OTP;
          this.emailMessage = result.Message;
          if (result.OTP != "")
            this.isMakeEmailReadonly = true;
        }
      }

    });
  }

  SubmitOtp() {
    if (this.otpReceived == this.formGroupSubmitOtp.value["OtpReceived"]) {
      this.sessionSet("_currentEmail", this.formGroupEmailToGetOtp.value["EmailForOtp"]);
      // window.location.href='https://www.demomarketplace.drstellamd.com/Subscription/List?email='+this.formGroupEmailToGetOtp.value["EmailForOtp"];
      this.element1.click();  //This will close the modal by clicking the UI button
      this.router.navigate(["/customer"]);
    }
    else {
      this.isOtpMismatch = true;
      this.otpMismatchMessage = "OTP is not correct";
    }
  }

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void {
    this.isMenuOpened = false;
  }

  // LoadUILinks() {
  //   try {

  //     // debugger;
  //     this.productService.getUiLinksAsync().subscribe(s => {
  //       let result = s;
  //       this.linksForUiList = result.Data;

  //       this.urlLetAmericaLive = this.linksForUiList.filter(p => p.LinkName == 'LetAmericaLive').map(p => p.LinkUrl)[0] ?? "";

  //     });
  //   }
  //   catch (e) {

  //   }
  // }

  sessionSet(key: any, value: any, expirationInMin = 120) {
    let expirationDate = new Date(new Date().getTime() + (60000 * expirationInMin))
    let newValue = {
      value: value,
      expirationDate: expirationDate.toISOString()
    }
    window.sessionStorage.setItem(key, JSON.stringify(newValue))
  }


  public checkError = (controlName: string, errorName: string) => {
    return this.formGroupEmailToGetOtp.controls[controlName].hasError(errorName);
  };

  CallProductCheckOutAddressDetails() {
    //debugger;
    //This will restrict only Cart Check-Out Navigation to Payment CheckOut Page
    this.productInternal.varPaymentPageNavProtectVal = 1;

    //debugger;
    this.productInternal.sendClickEvent_CallProductCheckOutAddressDetails();
  }

  // CheckOutButtonEnableDisable() {
  //   if (this.productInternal.objProductsInCart.length <= 0)
  //     this.productInternal.isCheckOutButtonDisabled = true;
  //   else
  //     this.productInternal.isCheckOutButtonDisabled = false;
  // }

  CheckCartCount() {
    //debugger;
    this.productInternal.FuncCheckOutButtonEnableDisable();
    this.productInternal.FuncUpdateTotalProductPriceAndCountInCart();
  }

  //#region 
  Fn_QuantityMinus(productId: number, productColors: ProductColor[] | undefined | null, productSizes: ProductSize[] | undefined | null) {
    this.productInternalOperation.Fn_QuantityMinus(productId, productColors, productSizes);
  }

  Fn_QuantityPlus(productId: number, productColors: ProductColor[] | undefined | null, productSizes: ProductSize[] | undefined | null) {
    this.productInternalOperation.Fn_QuantityPlus(productId, productColors, productSizes);
  }
  Fn_DeleteProduct(productId: number, productColors: ProductColor[] | undefined | null, productSizes: ProductSize[] | undefined | null) {
    //debugger;
    this.productInternalOperation.Fn_DeleteProduct(productId, productColors, productSizes);
  }
  //#endregion

  GoToProductPage() {
    //debugger;
    window.location.href = '/productlist?category=All';
  }

  customerSignOut() {
    window.sessionStorage.removeItem("_currentEmail");
    window.location.href = this.router['location']._platformLocation.location.origin;
  }

  OpenSupplementSummary() {
    this.supplementProductTotal = 0;

    this.productInternal.objCheckOutSupplementProductList
      .forEach(x => {
        this.supplementProductTotal = this.supplementProductTotal + x.SelectedProductPrice
      });
  }

  CheckOutSupplement() {

    window.location.href = '/payment/supplementproduct';
  }

  GetProductPrice(finalAmt: number, Quantity: number) {
    return (finalAmt / Quantity);
  }

}
