
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceUrl } from '../service-url';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  subscriptionApi?: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private serviceUrl: ServiceUrl, private http: HttpClient) {
    this.subscriptionApi = this.serviceUrl.subscriptionService;
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }

  getOtpAsync(email: string) {
    const payload: string = JSON.stringify(email);

    return this.http.get<any>
      (`${this.subscriptionApi}GetOTP?email=` + email,
        { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  getSubscriptionDetailsByEmail(email: string) {
    const payload: string = JSON.stringify(email);

    return this.http.get<any>
      (`${this.subscriptionApi}GetSubscriptionDetailsByEmail?email=` + email,
        { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  activeOrInActiveSubscription(activationFlag: boolean, scheduleId: number) {

    return this.http.get<any>
      (`${this.subscriptionApi}ActiveOrInActiveSubscription?activationFlag=` + activationFlag + `&scheduleId=` + scheduleId,
        { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  deleteProductSubscription(scheduleId: number) {

    return this.http.get<any>
      (`${this.subscriptionApi}DeleteProductSubscription?scheduleId=` + scheduleId,
        { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  updateCustomerCardDetails(cardDetails: any): Observable<any> {

    var postData = JSON.stringify(cardDetails);
    // const postData = { cust_Subscription: cardDetails };

    var url = `${this.subscriptionApi}UpdateCustomerCardDetails`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));

  }
}
