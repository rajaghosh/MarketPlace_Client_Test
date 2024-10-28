import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaymentModel } from '../../../app/models/checkout.model';
import { PaymentResponseModel, ProductAffliatePaymentModel, ProductModel } from '../../../app/models/product.model';
import { ServiceUrl } from '../service-url';
// import 'rxjs/Rx';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  paymentApi?: string;
  affliateApi?: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private serviceUrl: ServiceUrl, private http: HttpClient) {
    this.paymentApi = this.serviceUrl.paymentService;
    this.affliateApi = this.serviceUrl.affliateService;
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }


  getShipmentChargeAsync(CountryName: string) {

    return this.http.get<any>(`${this.paymentApi}GetShippingChargeAsync?selectedCountry=` + CountryName, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getSupplementProductsAsync() {
    return this.http.get<any>(`${this.paymentApi}SupplementProductsAsync`, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getPromocodeDetailsAsync(PromocodeName: string) {

    return this.http.get<any>(`${this.paymentApi}GetPromoCodeByNameAsync?selectedPromoCodeName=` + PromocodeName, { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  postPaymentSubmissionAsync(PaymentModelData: PaymentModel, ProductList: ProductModel[], AffliatePayments : ProductAffliatePaymentModel[], Affliate : string): Observable<any> {

    const postData = { payment: PaymentModelData, products: ProductList, affliatePayment: AffliatePayments, affliateEmail: Affliate };

    var url = `${this.paymentApi}PaymentPostAsync`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));
  }

  // postPaymentSupplementSubmissionAsync(PaymentModelData: PaymentModel, ProductList: ProductModel[], AffliatePayments: ProductAffliatePaymentModel[]): Observable<any> {

  //   debugger;
  //   const postData = { payment: PaymentModelData, products: ProductList, affliatePayment: AffliatePayments };

  //   var url = `${this.paymentApi}SupplementProductsPaymentAsync`;

  //   return this.http.post(url, postData, { headers: this.headers }).pipe(
  //     catchError(this.errorHandler));
  // }

  postPaymentSupplementSubmissionAsync(PaymentModelData: PaymentModel, ProductList: ProductModel[]): Observable<any> {

    // debugger;
    const postData = { payment: PaymentModelData, products: ProductList };

    var url = `${this.paymentApi}SupplementProductsPaymentAsync`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));
  }


  //Affliate Users Check with discount validation before payment 
  // CheckSanityOfAffliateAsync(AffliatePayments: ProductAffliatePaymentModel[]): Observable<any> {
  //   // affliateService
  //   debugger;
  //   const postData = AffliatePayments;
  //   var url = `${this.affliateApi}CheckSanityOfAffliateAsync`;

  //   return this.http.post(url, postData, { headers: this.headers }).pipe(
  //     catchError(this.errorHandler));
  // }

  //Affliate Users Check with discount validation before payment 
  // UpdateSaleAffliateAsync(AffliatePayments: ProductAffliatePaymentModel[]): Observable<any> {
  //   // affliateService
  //   debugger;
  //   const postData = AffliatePayments ;
  //   var url = `${this.affliateApi}UpdateSaleAffliateAsync`;

  //   return this.http.post(url, postData, { headers: this.headers }).pipe(
  //     catchError(this.errorHandler));
  // }


}
