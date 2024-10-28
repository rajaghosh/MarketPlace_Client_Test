import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckOutBillingDetails, CheckOutCardDetails, CheckoutDetails, CheckOutShippingDetails } from '../../../models/checkout.model';
import { ProductInternalService } from 'src/app/services/common-services/product-internal.service';
import { CountryModel } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-check-out',
  templateUrl: './product-check-out.component.html',
  styleUrls: ['./product-check-out.component.css']
})
export class ProductCheckOutComponent implements OnInit {


  formGroupProductCheckOutAddress: FormGroup = new FormGroup({});   //This form group will capture all the data for address
  productCheckOutTitle: string = "Customer Details";
  isBillingAddressSameAsShippingAddress: boolean = false;
  countryList: CountryModel[];
  customerCheckOutDetails: CheckoutDetails = {} as CheckoutDetails;
  isBillingDetailsReadonly: boolean = false;


  // testData: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any                                              //inputData - Input from parent component
    , private fBuilder: FormBuilder                                                             //fBuilder - Form for this child component
    , private dialog_OpenProductCheckOut_Reference: MatDialogRef<ProductCheckOutComponent>      //dialog_OpenProductCheckOut_Request - This is the request reference from the parent component
    , public productInternal: ProductInternalService
  ) {

    this.countryList = this.productInternal.varCountryListFromJson;
  }

  ngOnInit(): void {
    this.formGroupProductCheckOutAddress
      = this.fBuilder.group({

        CardDetailsCardHolderName: new FormControl('', Validators.required),
        CardDetailsCardNumber: new FormControl("", [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
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
        ]),
        CardDetailsExpiryYear: new FormControl("", [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("^[0-9]*$"),
        ]),
        CardDetailsAmount: new FormControl((this.productInternal.varTotalAmount != 0) ? "$" + this.productInternal.varTotalAmount.toFixed(2) : "$0"),
        // CardDetailsShipmentCharges: new FormControl(),
        // CardDetailsTotal: new FormControl(),
        CardDetailsShipmentCharge: new FormControl("0"),
        CardDetailsTotalPrice: new FormControl((this.productInternal.varTotalAmount != 0) ? "$" + this.productInternal.varTotalAmount.toFixed(2) : "$0"),
        CardDetailsPromoCode: new FormControl(""),

        ShippingDetailsFirstName: new FormControl('', Validators.required),
        ShippingDetailsLastName: new FormControl('', Validators.required),
        ShippingDetailsEmail: new FormControl('', [Validators.required, Validators.email,]),
        ShippingDetailsPhoneNo: new FormControl('', Validators.required),
        ShippingDetailsShippingAddress1: new FormControl('', Validators.required),
        ShippingDetailsShippingAddress2: new FormControl(''),
        ShippingDetailsShippingCity: new FormControl('', Validators.required),
        ShippingDetailsShippingState: new FormControl('', Validators.required),
        ShippingDetailsShippingCountry: new FormControl(''),
        ShippingDetailsZipcode: new FormControl('', Validators.required),

        BillingDetailIsSameAsShippingAddress: false,
        BillingDetailsBillingAddress: new FormControl('', Validators.required),
        BillingDetailsCity: new FormControl('', Validators.required),
        BillingDetailsState: new FormControl('', Validators.required),
        BillingDetailsZipcode: new FormControl('', Validators.required),

      });
  }

  checkToggle() {
    var billingAddress = "";
    var billingCity = "";
    var billingState = "";
    var billingZipCode = "";

    if (this.formGroupProductCheckOutAddress.value["BillingDetailIsSameAsShippingAddress"] == true) {

      //Set Value
      billingAddress = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingAddress1"] + " "
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

  //Returning the current form data on close
  save() {



    this.customerCheckOutDetails.BillingDetails = {} as CheckOutBillingDetails;
    this.customerCheckOutDetails.CardDetails = {} as CheckOutCardDetails;
    this.customerCheckOutDetails.ShippingDetails = {} as CheckOutShippingDetails;

    this.customerCheckOutDetails.CardDetails.CardHolderName = this.formGroupProductCheckOutAddress.value["CardDetailsCardHolderName"];
    this.customerCheckOutDetails.CardDetails.CardNumber = this.formGroupProductCheckOutAddress.value["CardDetailsCardNumber"];
    this.customerCheckOutDetails.CardDetails.CVC = this.formGroupProductCheckOutAddress.value["CardDetailsCVC"];
    this.customerCheckOutDetails.CardDetails.ExpiryMonth = this.formGroupProductCheckOutAddress.value["CardDetailsExpiryMonth"];
    this.customerCheckOutDetails.CardDetails.ExpiryYear = this.formGroupProductCheckOutAddress.value["CardDetailsExpiryYear"];
    this.customerCheckOutDetails.CardDetails.Amount = this.formGroupProductCheckOutAddress.value["CardDetailsAmount"];
    this.customerCheckOutDetails.CardDetails.ShipmentCharges = this.formGroupProductCheckOutAddress.value["CardDetailsShipmentCharge"];
    this.customerCheckOutDetails.CardDetails.Total = this.formGroupProductCheckOutAddress.value["CardDetailsTotalPrice"];
    this.customerCheckOutDetails.CardDetails.PromoCode = this.formGroupProductCheckOutAddress.value["CardDetailsPromoCode"];

    this.customerCheckOutDetails.ShippingDetails.FirstName = this.formGroupProductCheckOutAddress.value["ShippingDetailsFirstName"];
    this.customerCheckOutDetails.ShippingDetails.LastName = this.formGroupProductCheckOutAddress.value["ShippingDetailsLastName"];
    this.customerCheckOutDetails.ShippingDetails.Email = this.formGroupProductCheckOutAddress.value["ShippingDetailsEmail"];
    this.customerCheckOutDetails.ShippingDetails.PhoneNo = this.formGroupProductCheckOutAddress.value["ShippingDetailsPhoneNo"];
    this.customerCheckOutDetails.ShippingDetails.ShippingAddress1 = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingAddress1"];
    this.customerCheckOutDetails.ShippingDetails.ShippingAddress2 = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingAddress2"];
    this.customerCheckOutDetails.ShippingDetails.ShippingCity = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingCity"];
    this.customerCheckOutDetails.ShippingDetails.ShippingState = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingState"];
    this.customerCheckOutDetails.ShippingDetails.ShippingCountry = this.formGroupProductCheckOutAddress.value["ShippingDetailsShippingCountry"];
    this.customerCheckOutDetails.ShippingDetails.Zipcode = this.formGroupProductCheckOutAddress.value["ShippingDetailsZipcode"];

    this.customerCheckOutDetails.BillingDetails.BillingAddress1 = this.formGroupProductCheckOutAddress.value["BillingDetailsBillingAddress"];
    this.customerCheckOutDetails.BillingDetails.City = this.formGroupProductCheckOutAddress.value["BillingDetailsCity"];
    this.customerCheckOutDetails.BillingDetails.State = this.formGroupProductCheckOutAddress.value["BillingDetailsState"];
    this.customerCheckOutDetails.BillingDetails.Zipcode = this.formGroupProductCheckOutAddress.value["BillingDetailsZipcode"];

    this.dialog_OpenProductCheckOut_Reference.close(this.customerCheckOutDetails);
  }

  close() {
    this.dialog_OpenProductCheckOut_Reference.close();

  }

  public checkError = (controlName: string, errorName: string) => {
    return this.formGroupProductCheckOutAddress.controls[controlName].hasError(errorName);
  };

  DisallowSpace(event: any) {
    return event.keyCode != 32 ? event : event.preventDefault();
  }
}
