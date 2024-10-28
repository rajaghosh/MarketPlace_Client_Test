import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  // varCurrentUrl: string = "";
  varPrevUrl: string = "";

  constructor() { }

  FunctionCleanUrlInfoFromLocalStorage() {
    if (localStorage.getItem("prevUrl") !== null) {
      localStorage.removeItem("prevUrl");
    }
  }

  FunctionSetUrlInfoInLocalStorage() {
    if (localStorage.getItem("prevUrl") !== null) {
      localStorage.removeItem("prevUrl");
    }

    localStorage.setItem("prevUrl", JSON.stringify(this.varPrevUrl));
  }

  FunctionGetUrlInfoInLocalStorage() {
    //debugger;
    if (localStorage.getItem("prevUrl") !== null) {
      this.varPrevUrl
        = JSON.parse(localStorage.getItem("prevUrl") ?? "false");

      // this.varSelectedSupplements = this.productInternal?.objCheckOutSupplementProductList?.map(x => x.Product);
    }
    else {
      this.varPrevUrl = "";
    }

  }











}
