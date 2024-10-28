import { environment } from '../../environments/environment'
import { Injectable } from "@angular/core";

@Injectable()
export class ServiceUrl {
  productService?: string;
  subscriptionService?: string;
  paymentService?: string;

  affliateService?: string;

  constructor() {
    this.productService = environment.apiUrlService + "Product/";
    this.subscriptionService = environment.apiUrlMain + "Subscription/";
    this.paymentService = environment.apiUrlMain + "Payment/";

    this.affliateService = environment.affliateService + "User/";
  }

}
