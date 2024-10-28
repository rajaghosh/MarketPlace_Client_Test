import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceUrl } from '../service-url';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productApi?: string;
  affliateApi?:string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private serviceUrl: ServiceUrl, private http: HttpClient) {
    this.productApi = this.serviceUrl.productService;
    this.affliateApi = this.serviceUrl.affliateService;
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }

  getProductsAsync(filter: number) {
    return this.http.get<any>(`${this.productApi}GetProductsAsync?filter=` + filter, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getFeatureProductsAsync() {
    return this.http.get<any>(`${this.productApi}GetProductsAsync?filter=0&showFeaturedOnly=true`, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getBestSellerProductsAsync() {
    return this.http.get<any>(`${this.productApi}GetProductsAsync?filter=0&showBestSellerOnly=true`, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getProductByIdAsync(prodId: number) {
    return this.http.get<any>(`${this.productApi}GetProductByIdAsync?prodId=` + prodId, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getProductColorsSizesAsync(productId: number) {
    return this.http.get<any>(`${this.productApi}GetAllColorsSizesByProductIdAsync?prodId=` + productId, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getUiLinksAsync() {
    return this.http.get<any>(`${this.productApi}GetUiLinksAsync`, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  getUiTopRowBannerAsync() {
    return this.http.get<any>(`${this.productApi}GetUiTopRowBannerAsync`, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

  //Affliate User Check
  getValidationForAffliateUser(affliateCode: string){
    // affliateService
    // debugger;
    return this.http.get<any>(`${this.affliateApi}GetValidationForAffliateUser?checkdata=`+affliateCode, { headers: this.headers }).pipe(catchError(this.errorHandler));
  }

}
