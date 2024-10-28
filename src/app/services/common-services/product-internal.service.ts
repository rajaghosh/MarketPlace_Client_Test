import { Injectable } from '@angular/core';
import { ProductCartModel, CountryModel } from '../../models/product.model';
import { CheckoutDetails } from '../../models/checkout.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from  '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductInternalService {

  public varProductCount: number = 0;
  public objProductsInCart: ProductCartModel[] = [];
  public varTotalAmount: number = 0;
  public varIsCartEmpty: boolean = false;
  public varProductDesctiptionOnModal: string = "";
  public objCheckOutDetails: CheckoutDetails = {} as CheckoutDetails;
  public varCountryListFromJson: CountryModel[] = [];
  public uriProductLocationCloud: string = environment.apiUrlImageProducts;//'https://marketplaceadmin.drstellamd.com/UploadFiles/ProductImages/';
  public varIsPaymentPageShowUsingChildComponent: boolean = false;
  public objCheckOutProductList: ProductCartModel[] = [];
  public objCheckOutSupplementProductList: ProductCartModel[] = [];
  public isCheckOutButtonDisabled: boolean = false;
  public varPaymentPageNavProtectVal : number = 0;
  public objUrlVisitedList : string[] = [];


  FuncGetNamePartFromNameString(namePart: string): string {
    return namePart?.split(":")[0].trim();
  }
  FuncGetPricePartFromNameString(namePart: string): string {
    return namePart?.split(":")[1].trim();
  }

  FuncGetDiscountedPrice(actualPrice: number | undefined, discountPercent: number | undefined): string | undefined {
    if (actualPrice != undefined && discountPercent != undefined)
      return (actualPrice * (100 - discountPercent) / 100).toFixed(2);
    else
      return actualPrice?.toFixed(2);
  }

  FuncUpdateTotalProductPriceAndCountInCart() {
    //Update cart details from local
    // this.FuncGetCartDataFromLocalStorage();

    // debugger;
    this.varTotalAmount
      = (this.objProductsInCart.length > 0)
        ? this.objProductsInCart.map(x => x.FinalAmount).reduce((ty, u) => ty + u, 0)
        : 0;

    this.varIsCartEmpty = this.varProductCount == 0 ? true : false;

    this.UpdatePaymentCheckoutAmountOnCartUpdate();
  }

  UpdatePaymentCheckoutAmountOnCartUpdate() {
    this.sendClickEvent_UpdateProductCheckOutAmountValue();
  }


  FuncGetCountryList() {

  }

  public FuncGetCountryListJSON(): Observable<any> {
    return this.httpClient.get(this._jsonCountryURL);
  }

  public FunctionCleanCartDataFromLocalStorage() {
    if (localStorage.getItem("cartData") !== null) {
      localStorage.removeItem("cartData");
    }
  }

  public FuncSetCartDataToLocalStorage() {

    if (localStorage.getItem("cartData") !== null) {
      localStorage.removeItem("cartData");
    }

    localStorage.setItem("cartData", JSON.stringify(this.objProductsInCart));

    this.FuncGetCartDataFromLocalStorage();
  }

  public FuncGetCartDataFromLocalStorage() {

    if (localStorage.getItem("cartData") !== null) {
      this.objProductsInCart = JSON.parse(localStorage.getItem("cartData") ?? "false") as ProductCartModel[];
    }
    else {
      this.objProductsInCart = [];
    }
    //This will refresh the cart count
    this.varProductCount = this.objProductsInCart.length;
  }

  public FuncCheckOutButtonEnableDisable(isProductAdded: boolean = false) {

    if (!isProductAdded) {
      //When ever we are clicking on the cart button we need to check from local storage
      this.FuncGetCartDataFromLocalStorage();
    }

    if (this.objProductsInCart.length <= 0)
      this.isCheckOutButtonDisabled = true;
    else
      this.isCheckOutButtonDisabled = false;
  }

  //#region Product_CheckOut_AddressDetails - WE RECEIVE CLICK EVENT FROM HEADER COMPONENT TO PASS IT PRODUCT/HOME/EXPLORE COMPONENT
  private subjectCallProductCheckOutAddressDetails = new Subject<any>();

  sendClickEvent_CallProductCheckOutAddressDetails() {
    this.subjectCallProductCheckOutAddressDetails.next();
  }
  getClickEvent_CallProductCheckOutAddressDetails(): Observable<any> {
    return this.subjectCallProductCheckOutAddressDetails.asObservable();
  }
  //#endregion


  //#region Product_CheckOut_AmountValue - WE RECEIVE CLICK EVENT FROM HEADER COMPONENT TO PASS IT PAYMENT COMPONENT
  private subjectUpdateProductCheckOutAmountValue = new Subject<any>();

  sendClickEvent_UpdateProductCheckOutAmountValue() {
    this.subjectUpdateProductCheckOutAmountValue.next();
  }
  getClickEvent_UpdateProductCheckOutAmountValue(): Observable<any> {
    return this.subjectUpdateProductCheckOutAmountValue.asObservable();
  }
  //#endregion

  //#region Fetching Country List from JSON
  //JSON URL
  private _jsonCountryURL = '../../../assets/json/countries.json';

  constructor(private httpClient: HttpClient) {
    this.FuncGetCountryListJSON().subscribe(data => {
      this.varCountryListFromJson = data.Countries;

      console.log(data.Countries);
    });
  }

  //#endregion

}
