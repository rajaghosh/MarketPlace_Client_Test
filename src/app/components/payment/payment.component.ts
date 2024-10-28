import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckOutBillingDetails, CheckOutCardDetails, CheckoutDetails, CheckOutShippingDetails, PaymentModel } from '../../models/checkout.model';
import { ProductInternalService } from '../../../app/services/common-services/product-internal.service';
import { CountryModel, PaymentResponseModel, ProductAffliateDiscount, ProductAffliatePaymentModel, ProductModel, ProductSubscriptionModel, PromoCodeModel } from '../../../app/models/product.model';
import { PaymentService } from '../../../app/services/http-services/payment.service';
import { Navigation, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { ProductInternalOperationService } from '../../services/common-services/product-internal-operation.service';
import { PaymentNormalService } from '../../services/common-services/payment-normal.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// import { VERSION } from '@angular/core';
import { UrlService } from '../../services/common-services/url.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  formGroupProductCheckOutAddress: FormGroup = new FormGroup({});   //This form group will capture all the data for address
  countryList: CountryModel[] = [];

  isBillingDetailsReadonly: boolean = false;
  paymentData: PaymentModel = {} as PaymentModel;
  productList: ProductModel[] = [];
  affliatePaymentList: ProductAffliatePaymentModel[] = [];

  shipmentCharge: number = 0;
  promocodeDetails: PromoCodeModel = {} as PromoCodeModel;
  isPromocodeButtonDisabled: boolean = true;
  discountedPercent: number = 0.00;
  discountedPrice: number = 0.00;
  promoCodeInvalidLabel: string = "";

  paymentResponse: PaymentResponseModel = {} as PaymentResponseModel;
  isCartEmpty: boolean = false;
  totalPriceWithShippingAndDiscount: number = 0.00;
  discountAmountShow: string = "";
  isAutoshipProductPayment: boolean = false;
  isNormalProductPayment: boolean = false;

  supplementProductAmount: number = 0;

  isPaymentConditionSelected: boolean = false;
  isSubscriptionRelatedProductPresent: boolean = false;

  readonly AUTOSHIP_AMT: number = 99.00;

  //This click event subcription will receive event message / trigger when "check out" clicked at the header component
  clickEventsubscription_UpdateProductCheckOutAmountValue: Subscription;

  constructor(
    private fBuilder: FormBuilder
    , public productInternal: ProductInternalService
    , private router: Router
    , private paymentService: PaymentService
    , public datepipe: DatePipe
    , private dialog: MatDialog
    , private productInternalOperation: ProductInternalOperationService
    , private urlService: UrlService
    , private _snackBar: MatSnackBar
    , private location: Location
    , private paymentNormal: PaymentNormalService
  ) {

    //This will restrict only Cart Check-Out Navigation to Payment CheckOut Page
    this.SetupInitialParameters();

    //This is a click event based redirection from cart to here
    this.clickEventsubscription_UpdateProductCheckOutAmountValue =
      this.productInternal
        .getClickEvent_UpdateProductCheckOutAmountValue()
        .subscribe(() => {
          this.UpdateTotalCheckoutAmountOnCartProductUpdate();
        });

  }

  ngOnInit(): void {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

  }

  SetupInitialParameters() {
    let currentUrl: string = window.location.href;

    //For Autoship/Supplement Product
    if (currentUrl.includes("supplementproduct") == true) {

      this.productInternalOperation.FunctionGetSupplementProductCartInLocalStorage();
      if (this.productInternal.objCheckOutSupplementProductList.length == 3) {
        this.isAutoshipProductPayment = true;
        this.isNormalProductPayment = false;
      }
      else {
        this.isAutoshipProductPayment = false;
        this.isNormalProductPayment = false;
        this.ProceedToHomePage();
      }
    }
    //Normal Payment
    else if (currentUrl.includes("checkout") == true) {

      //If cart has data
      if (this.productInternal.objProductsInCart.length > 0) {

        this.isAutoshipProductPayment = false;
        this.isNormalProductPayment = true;

        this.CheckIfSubscriptionProductPresent();
      }
      else if (this.productInternal.objProductsInCart.length <= 0) {

        this.isAutoshipProductPayment = false;
        this.isNormalProductPayment = false;

        this.router.navigate(['productlist']);
      }
    }

    //To Populate country list on Page Load
    this.productInternal.FuncGetCountryListJSON().subscribe(data => {
      this.countryList = data.Countries;
    });

    //This will setup form controls
    this.SetupFormControls();

    if (this.productInternal.varTotalAmount > 0) {
      this.isPromocodeButtonDisabled = false;
    }

    this.GetShippingPriceByCountry("United States");
    this.SetTotalPrice();
  }

  //This will be triggered using EVENT (From Product Shared Service on Cart Value Update)
  UpdateTotalCheckoutAmountOnCartProductUpdate() {

    if (this.isAutoshipProductPayment == true) {
      this.productInternalOperation.FunctionGetSupplementProductCartInLocalStorage(); //From Local Storage Fetch Autoship Products
    }
    else if (this.isNormalProductPayment == true) {
      //If cart empty redirect to Product Page
      if (this.productInternal.objProductsInCart.length <= 0) {
        this.isCartEmpty = true;
      }
      else {
        this.isCartEmpty = false;
      }

      this.CheckIfSubscriptionProductPresent(); //For normal payment check if there is any subscription present
      this.totalPriceWithShippingAndDiscount = this.productInternal.varTotalAmount + this.shipmentCharge - this.discountedPrice; //Get Total Price from all calculation

      this.formGroupProductCheckOutAddress.controls['CardDetailsAmount']?.setValue('$' + this.productInternal.varTotalAmount.toFixed(2)); //Get total amount from the cart
      this.formGroupProductCheckOutAddress.get('CardDetailsTotalPrice')?.setValue('$' + this.totalPriceWithShippingAndDiscount.toFixed(2));
    }
  }

  SetupFormControls() {

    this.formGroupProductCheckOutAddress
      = this.fBuilder.group({

        CardDetailsCardHolderName: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        CardDetailsCardNumber: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(16),
          Validators.maxLength(16),
          // Validators.maxLength(16),
        ]),
        CardDetailsCVC: new FormControl("", [
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern("^[0-9]*$"),
        ]),
        CardDetailsExpiryMonth: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.max(12),
        ]),
        CardDetailsExpiryYear: new FormControl("", [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("^[0-9]*$"),
        ]),
        CardDetailsAmount: new FormControl((this.productInternal.varTotalAmount != 0) ? "$" + this.productInternal.varTotalAmount.toFixed(2) : "$0"),

        CardDetailsShipmentCharge: new FormControl("0"),

        CardDetailsTotalPrice: new FormControl("0", Validators.required),
        CardDetailsPromoCode: new FormControl(""),

        ShippingDetailsFirstName: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        ShippingDetailsLastName: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        ShippingDetailsEmail: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.maxLength(100),
        ]),
        ShippingDetailsPhoneNo: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
        ]),
        ShippingDetailsShippingAddress1: new FormControl('', [
          Validators.required,
          Validators.maxLength(200),
        ]),
        ShippingDetailsShippingAddress2: new FormControl('', [
          Validators.maxLength(200),
        ]),
        ShippingDetailsShippingCity: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        ShippingDetailsShippingState: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        ShippingDetailsShippingCountry: new FormControl('', [
          Validators.required
        ]),
        ShippingDetailsZipcode: new FormControl('', [
          Validators.required,
          Validators.maxLength(10),
        ]),
        FindAboutUs: new FormControl('', Validators.maxLength(300)),
        BillingDetailIsSameAsShippingAddress: false,

        BillingDetailsBillingAddress: new FormControl('', [
          Validators.required,
          Validators.maxLength(401),
        ]),
        BillingDetailsCity: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        BillingDetailsState: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        BillingDetailsZipcode: new FormControl('', [
          Validators.required,
          Validators.maxLength(10),
        ]),

      });
  }

  ReturnToProducts() {
    //If there is any autoship item list then that will be cleared
    this.productInternalOperation.FunctionCleanSupplementProductCartInLocalStorage();
    window.location.href = '/productlist?category=All';
  }


  CheckIfSubscriptionProductPresent() {

    var subscriptionProducts = this.productInternal.objProductsInCart.filter(p => p.SelectedSubscription != undefined && p.SelectedSubscription != null)
    if (subscriptionProducts != null && subscriptionProducts != undefined && subscriptionProducts.length > 0) {
      this.isSubscriptionRelatedProductPresent = true;
    }
    else {
      this.isSubscriptionRelatedProductPresent = false;
    }
  }

  //This method will be called EveryTime when any update happens related to TotalPrice Update
  SetTotalPrice() {

    //For AutoShip
    if (this.isAutoshipProductPayment == true) {
      let sum: number = 0;
      this.productInternal.objCheckOutSupplementProductList.forEach(p => { sum = sum + p.SelectedProductPrice });
      this.supplementProductAmount = sum;

      this.totalPriceWithShippingAndDiscount = this.AUTOSHIP_AMT + this.shipmentCharge - this.discountedPrice;

      this.formGroupProductCheckOutAddress.controls['CardDetailsAmount']?.setValue('$' + this.AUTOSHIP_AMT.toFixed(2));
      this.formGroupProductCheckOutAddress.get('CardDetailsTotalPrice')?.setValue('$' + this.totalPriceWithShippingAndDiscount.toFixed(2));
    }
    //For Normal Payment
    else if (this.isAutoshipProductPayment == false) {
      this.totalPriceWithShippingAndDiscount = this.productInternal.varTotalAmount + this.shipmentCharge - this.discountedPrice;

      this.formGroupProductCheckOutAddress.get('CardDetailsTotalPrice')?.setValue('$' + this.totalPriceWithShippingAndDiscount.toFixed(2));
    }
  }

  //This will be used when we toggle to duplicate address
  checkToggle() {
    var billingAddress = "";
    var billingCity = "";
    var billingState = "";
    var billingZipCode = "";

    if (this.formGroupProductCheckOutAddress.value["BillingDetailIsSameAsShippingAddress"] == true) {

      //Set Value
      billingAddress = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingAddress1"] + ","
        + this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingAddress2"];
      billingCity = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingCity"];
      billingState = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingState"];
      billingZipCode = this.formGroupProductCheckOutAddress.value["ShippingDetailsZipcode"];

      //Disable Control
      this.isBillingDetailsReadonly = true;
    }
    else {
      //Enable Control
      this.isBillingDetailsReadonly = false;

    }
    this.formGroupProductCheckOutAddress.get('BillingDetailsBillingAddress')?.setValue(billingAddress);
    this.formGroupProductCheckOutAddress.get("BillingDetailsCity")?.setValue(billingCity);
    this.formGroupProductCheckOutAddress.get("BillingDetailsState")?.setValue(billingState);
    this.formGroupProductCheckOutAddress.get("BillingDetailsZipcode")?.setValue(billingZipCode);
  }

  //Send Payload to BE and make payment
  MakePayment() {

    if (this.formGroupProductCheckOutAddress.value["CardDetailsAmount"] == "$0.00") {
      this.openSnackBar("The cart is empty. Please check.", "Dismiss");
      return;
    }

    //Populating the Payment Model
    this.paymentData.PaymentId = 0;
    this.paymentData.CustomerId = 0;
    this.paymentData.TempId = 0;
    this.paymentData.CardHolderName = this.formGroupProductCheckOutAddress.value["CardDetailsCardHolderName"];
    this.paymentData.CVC = this.formGroupProductCheckOutAddress.value["CardDetailsCVC"].toString();
    this.paymentData.CardNumber = this.formGroupProductCheckOutAddress.value["CardDetailsCardNumber"];
    this.paymentData.ExpiryMonth = this.formGroupProductCheckOutAddress.value["CardDetailsExpiryMonth"].toString();
    this.paymentData.ExpiryYear = this.formGroupProductCheckOutAddress.value["CardDetailsExpiryYear"].toString();
    this.paymentData.Amount = this.formGroupProductCheckOutAddress.value["CardDetailsAmount"]; //Actual Amount 
    this.paymentData.AmountAfterPromoApplied = this.productInternal.varTotalAmount - this.shipmentCharge;

    this.paymentData.SelectedShippingCharge = this.shipmentCharge;
    this.paymentData.PromocodeName = this.promocodeDetails?.PromoName ?? "";
    this.paymentData.PromoPercent = this.promocodeDetails?.PromoPercent ?? 0.00;
    this.paymentData.CycleValue = 0;
    this.paymentData.PromocodeId = this.promocodeDetails?.Id ?? "";
    this.paymentData.FirstName = this.formGroupProductCheckOutAddress.value["ShippingDetailsFirstName"];
    this.paymentData.LastName = this.formGroupProductCheckOutAddress.value["ShippingDetailsLastName"];
    this.paymentData.Email = this.formGroupProductCheckOutAddress.value["ShippingDetailsEmail"];
    this.paymentData.PhoneNo = this.formGroupProductCheckOutAddress.value["ShippingDetailsPhoneNo"];
    this.paymentData.ShippingAddress1 = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingAddress1"];
    this.paymentData.ShippingAddress2 = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingAddress2"];
    this.paymentData.ShippingCity = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingCity"];
    this.paymentData.ShippingState = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingState"];
    this.paymentData.ShippingZipCode = this.formGroupProductCheckOutAddress.value["ShippingDetailsZipcode"];
    this.paymentData.ShippingCountry = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingCountry"];
    this.paymentData.DeliveryAddress1 = this.formGroupProductCheckOutAddress.value["BillingDetailsBillingAddress"];
    this.paymentData.DeliveryAddress2 = "";
    this.paymentData.DeliveryCity = this.formGroupProductCheckOutAddress.value["BillingDetailsCity"];
    this.paymentData.DeliveryState = this.formGroupProductCheckOutAddress.value["BillingDetailsState"];
    this.paymentData.DeliveryZipCode = this.formGroupProductCheckOutAddress.value["BillingDetailsZipcode"];

    this.paymentData.DeliveryAgencyId = 0;
    this.paymentData.SubscriptionCheck = this.isSubscriptionRelatedProductPresent;
    this.paymentData.IsSchedulePayment = undefined;
    this.paymentData.UerPaymentCount = 0;
    this.paymentData.FindAboutUs = this.formGroupProductCheckOutAddress.value["FindAboutUs"];

    if (this.isAutoshipProductPayment == true) {
      this.productInternal.objCheckOutSupplementProductList.forEach(p => {
        p.Product.Quantity = p.ProductCount;
        p.Product.SelectedSubscription = p.SelectedSubscription ?? {} as ProductSubscriptionModel;
      });

      //This is for fix price $99 calculation
      this.productList = this.productInternal.objCheckOutSupplementProductList.map(p => p.Product);
      this.paymentData.Amount = this.AUTOSHIP_AMT;
      this.paymentData.AmountAfterPromoApplied = this.AUTOSHIP_AMT;
    }
    else if (this.isNormalProductPayment == true) {
      this.productInternal.objProductsInCart.forEach(p => {
        p.Product.Quantity = p.ProductCount;
        p.Product.Price = p.SelectedProductPrice;
        p.Product.SelectedSubscription = p.SelectedSubscription ?? {} as ProductSubscriptionModel;
      });

      this.productList = this.productInternal.objProductsInCart.map(p => p.Product);

      this.paymentData.Amount = this.productInternal.varTotalAmount;
      this.paymentData.AmountAfterPromoApplied = this.productInternal.varTotalAmount - this.discountedPrice;

      this.productList.forEach(prodRef => {

        let prodDetails = this.productInternal.objProductsInCart.filter(p => p.Product.Id == prodRef.Id).map(p => p)[0];

        if ((prodDetails.AffliateDiscount?.AffliateDiscount != null
          && prodDetails.AffliateDiscount?.AffliateDiscount != undefined
          && prodDetails.AffliateDiscount?.AffliateDiscount > 0)
          && prodDetails.AffliateDiscount?.AffliateEmail != "") {

          let affliateObj: ProductAffliatePaymentModel = {
            ProductId: prodDetails.Product.Id,
            ProductCount: prodDetails.ProductCount,
            SelectedProductPrice: prodDetails.Product.Price,
            FinalAmount: prodDetails.FinalAmount,
            AffliateDiscount: prodDetails.AffliateDiscount
          }

          this.affliatePaymentList.push(affliateObj);
        }
        else {
          var prodAffDiscount: ProductAffliateDiscount = {} as ProductAffliateDiscount;
          prodAffDiscount.AffliateDiscount = 0;
          prodAffDiscount.AffliateEmail = "";
          prodAffDiscount.ProductId = prodDetails.Product.Id;


          let affliateObj: ProductAffliatePaymentModel = {
            ProductId: prodDetails.Product.Id,
            ProductCount: prodDetails.ProductCount,
            SelectedProductPrice: prodDetails.Product.Price,
            FinalAmount: prodDetails.FinalAmount,
            AffliateDiscount: prodAffDiscount
          }

          // debugger;

          this.affliatePaymentList.push(affliateObj);
        }
      });

    }

    // console.log("Payment Model : " + JSON.stringify(this.paymentData));
    // console.log("Product List : " + JSON.stringify(this.productList));
    // debugger;

    //Payment portion commented for testing
    try {
      const dialogRefPaymentInProgress = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Payment in progress...",
          spinnerOn: true,
          confirmButtonText: '',
          buttonText: {
            ok: '',
            cancel: ''
          }
        }
      });

      this.paymentResponse.IsSuccess = false;



      //Payment For Supplement
      if (this.isAutoshipProductPayment == true) {
        this.paymentService.postPaymentSupplementSubmissionAsync(this.paymentData, this.productList).subscribe(s => {

          let result = s;
          this.paymentResponse = result.Data;

          //If payment Successful
          if (this.paymentResponse.IsSuccess) {

            dialogRefPaymentInProgress.close();

            const dialogRefPaymentSuccess = this.dialog.open(ConfirmDialogComponent, {
              disableClose: true,
              data: {
                message: "Payment is successful.",
                buttonText: {
                  ok: 'GO TO HOME'
                }
              }
            });

            dialogRefPaymentSuccess.afterClosed().subscribe((confirmed: boolean) => {
              if (confirmed) {
                const a = document.createElement('a');
                a.click();
                a.remove();

                //Remove product from supplement cart
                this.productInternalOperation.FunctionCleanSupplementProductCartInLocalStorage();

                this.ProceedToHomePage();
                // window.location.href = this.router['location']._platformLocation.location.origin;

              }
            });

          }
          else {

            dialogRefPaymentInProgress.close();

            const dialogRefPaymentIssue = this.dialog.open(ConfirmDialogComponent, {
              disableClose: true,
              data: {
                message: "Issue in payment. " + this.paymentResponse.Message,
                buttonText: {
                  ok: 'UPDATE DETAILS',
                  cancel: '',
                  Other: ''
                }
              }
            });

            dialogRefPaymentIssue.afterClosed().subscribe((confirmed: any) => {


              if (confirmed == true) {
                const a = document.createElement('a');
                a.click();
                a.remove();
                //Write a function call here
                // this.ProceedToAutoShip();
              }
              else if (confirmed == "OtherButtonClose") {
                // const a = document.createElement('a');
                // a.click();
                // a.remove();
              }
              else {
                this.MakePayment(); //Recursive
              }
            });

          }

        });
      }
     
      var affliateEmail = "";
      var localAffliateEmail = localStorage.getItem("affliateEmail");
      if(localAffliateEmail!=null)
        affliateEmail = JSON.parse(localAffliateEmail);

      //Normal Payment
      if (this.isAutoshipProductPayment == false) {
        this.paymentService.postPaymentSubmissionAsync(this.paymentData, 
                                                      this.productList, 
                                                      this.affliatePaymentList,
                                                      affliateEmail).subscribe(s => {

          let result = s;
          this.paymentResponse = result.Data;

          //If payment Successful
          if (this.paymentResponse.IsSuccess) {

            dialogRefPaymentInProgress.close();

            const dialogRefPaymentSuccess = this.dialog.open(ConfirmDialogComponent, {
              disableClose: true,
              data: {
                message: "Payment is successful.",
                buttonText: {
                  ok: 'GO TO HOME'
                }
              }
            });

            dialogRefPaymentSuccess.afterClosed().subscribe((confirmed: boolean) => {
              if (confirmed) {
                const a = document.createElement('a');
                a.click();
                a.remove();

                //Remove product from cart
                this.CleanCartContent();

                this.ProceedToHomePage();
              }
            });



          }
          else {

            dialogRefPaymentInProgress.close();

            const dialogRefPaymentIssue = this.dialog.open(ConfirmDialogComponent, {
              disableClose: true,
              data: {
                message: "Issue in payment. " + this.paymentResponse.Message,
                buttonText: {
                  ok: 'UPDATE DETAILS',
                  cancel: '',
                  Other: ''
                }
              }
            });

            dialogRefPaymentIssue.afterClosed().subscribe((confirmed: any) => {

              if (confirmed == true) {
                const a = document.createElement('a');
                a.click();
                a.remove();
                //Write a function call here
                //this.ProceedToHomePage();
              }
              else if (confirmed == "OtherButtonClose") {
                // const a = document.createElement('a');
                // a.click();
                // a.remove();
              }
              else {
                this.MakePayment(); //Recursive
              }
            });


          }



        });
      }



    }
    catch (e) {

    }
  }

  ProceedToHomePage() {
    window.location.href = this.router['location']._platformLocation.location.origin;
  }

  ProceedToAutoShip() {
    window.location.href = '/autoship-order/';
  }

  CleanCartContent() {
    this.productInternal.FunctionCleanCartDataFromLocalStorage();

    this.productInternal.FuncCheckOutButtonEnableDisable();
    this.productInternal.FuncUpdateTotalProductPriceAndCountInCart();

    //Clean Shared Data
    this.productInternalOperation.varCurrentProduct = {} as ProductModel;
    this.productInternalOperation.varResultDataList = [];
  }


  //#region GetShippingPriceByCountry
  GetShippingPriceByCountry(CountryName: string) {
    try {

      this.paymentService.getShipmentChargeAsync(CountryName).subscribe(s => {

        let result = s;
        this.shipmentCharge = result.Data;

        this.formGroupProductCheckOutAddress.get('CardDetailsShipmentCharge')?.setValue('$' + this.shipmentCharge);
        this.formGroupProductCheckOutAddress.get('ShippingDetailsShippingCountry')?.setValue(CountryName);
        this.SetTotalPrice();

      });
    }
    catch (e) {

    }
  }
  //#endregion

  //#region ApplyPromocodeByName - Move this method to BE
  ApplyPromocodeByName(PromoName: string) {

    try {

      this.paymentService.getPromocodeDetailsAsync(PromoName).subscribe(result => {

        // let result = s;
        this.promocodeDetails = result.Data;

        if (this.promocodeDetails != null
          && (this.promocodeDetails.StartDate != undefined || this.promocodeDetails.StartDate != null)
          && (this.promocodeDetails.EndDate != undefined || this.promocodeDetails.EndDate != null)
        ) {
          var currentDateTime: Date = new Date;
          var promoStartDate: Date = new Date(this.promocodeDetails.StartDate);
          var promoEndDate: Date = new Date(this.promocodeDetails.EndDate);

          if (promoStartDate <= currentDateTime
            && currentDateTime <= promoEndDate) {

            if (this.isAutoshipProductPayment == true) {
              //Currently not used - Will be used if promocode is used for autoship
              let sum: number = 0;
              this.productInternal.objCheckOutSupplementProductList.forEach(p => { sum = sum + p.SelectedProductPrice });
              this.supplementProductAmount = sum;

              this.discountedPercent = this.promocodeDetails.PromoPercent ?? 0.00;
              this.discountedPrice = this.AUTOSHIP_AMT * ((this.discountedPercent / 100)); //For Fix 99 Price Promocode
              this.promoCodeInvalidLabel = "";
              this.isPromocodeButtonDisabled = true;

              this.discountAmountShow = this.discountedPrice.toFixed(2);
            }
            else if (this.isAutoshipProductPayment == false) {
              this.discountedPercent = this.promocodeDetails.PromoPercent ?? 0.00;
              this.discountedPrice = this.productInternal.varTotalAmount * ((this.discountedPercent / 100));
              this.promoCodeInvalidLabel = "";
              this.isPromocodeButtonDisabled = true;

              this.discountAmountShow = this.discountedPrice.toFixed(2);
            }

            this.promoCodeInvalidLabel = "Promocode Applied";
          }
          else {
            this.promoCodeInvalidLabel = "Promocode Expired";
            this.isPromocodeButtonDisabled = false;
          }
        }
        //If Promocode Applied Is Invalid
        else {
          this.promoCodeInvalidLabel = "Promocode Invalid";
          this.isPromocodeButtonDisabled = false;
        }
        this.SetTotalPrice();
      });
    }
    catch (e) {

    }
  }
  //#endregion

  DisabledPayNowActions() {
    this.openSnackBar("Please validate all the input data.", "Dismiss");
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

  PaymentConditionSelect(event: any) {

    //If we load page and find previously we had 3 products selected - Local Storage
    if (event == null) {
      this.isPaymentConditionSelected = false;
    }
    else if (event.checked == true) {
      this.isPaymentConditionSelected = true;
    }
    else if (event.checked == false) {
      this.isPaymentConditionSelected = false;
    }
  }

  close() {
    this.location.back();
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.formGroupProductCheckOutAddress.controls[controlName].hasError(errorName);
  };

  DisallowSpace(event: any) {
    return event.keyCode != 32 ? event : event.preventDefault();
  }


}
