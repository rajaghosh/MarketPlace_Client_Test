import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/http-services/product.service';
import { ProductModel } from '../../models/product.model';
import { ProductInternalOperationService } from '../../services/common-services/product-internal-operation.service';
import { ProductInternalService } from '../../services/common-services/product-internal.service';
import { PaymentService } from '../../services/http-services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HomeInternalService } from '../../services/common-services/home-internal.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-autoship',
  templateUrl: './product-autoship.component.html',
  styleUrls: ['./product-autoship.component.css']
})
export class ProductAutoshipComponent implements OnInit {

  selectedSupplements: ProductModel[] = [];
  supplementProductList: ProductModel[] = [];
  nonSelectedProductList: ProductModel[] = [];
  selectedSupplementIds: number[] = [];
  nonSelectedSupplementIds: number[] = [];

  constructor(
    public productInternal: ProductInternalService,
    private productService: ProductService,
    private paymentService: PaymentService,
    public productInternalOperation: ProductInternalOperationService,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private router: Router,
    // public homeInternal: HomeInternalService,
  ) {

    this.GetSupplementProduct();


  }

  ngOnInit(): void {
  }


  GetSupplementProduct() {
    try {
      this.paymentService.getSupplementProductsAsync().subscribe(s => {

        let result = s;
        this.supplementProductList = result.Data;

        //Once Products are loaded well will fetch data
        
        this.productInternalOperation.FunctionGetSupplementProductCartInLocalStorage();
        this.selectedSupplements = this.productInternalOperation.varSelectedSupplements;
        this.SupplementSelect(null, null);
      });
    }
    catch (e) {

    }
  }

  SupplementSelect(product: ProductModel | null | undefined, event: any) {
    
    //If we load page and find previously we had 3 products selected - Local Storage
    if (event == null) {
  
      this.productInternalOperation.varSelectedSupplements = this.selectedSupplements;
      let nonSelectedIdsOnly = this.supplementProductList.map(x => x.Id).filter(x => !this.selectedSupplements.map(x => x.Id).includes(x));
      this.nonSelectedProductList = this.supplementProductList.filter(x => nonSelectedIdsOnly.includes(x.Id));

      //This is filter so that only 3 products are selected and then rest will be read only
      if (this.selectedSupplements.length < 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds.length = 0;
      }
      else if (this.selectedSupplements.length == 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds = nonSelectedIdsOnly;
      }
      else if (this.selectedSupplements.length > 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds = nonSelectedIdsOnly
      }

    }
    else if (event.checked == true && product != null && product != undefined) {

      //if we have 3 products then we will freeze other products
      //Operation Here
      if (this.selectedSupplements.length < 3) {
        //If product selected is 2 or less then we can add another product
        this.selectedSupplements.push(product);

        //Post product add if the cart count becomes 3
        if (this.selectedSupplements.length == 3) {
          this.openSnackBar("Products added. Please checkout.", "Dismiss");
        }
        this.productInternalOperation.AddSupplementProductInTempCart(this.selectedSupplements);
      }

      //********************************************************* */

      this.productInternalOperation.varSelectedSupplements = this.selectedSupplements;

      let nonSelectedIdsOnly = this.supplementProductList.map(x => x.Id).filter(x => !this.selectedSupplements.map(x => x.Id).includes(x));
      this.nonSelectedProductList = this.supplementProductList.filter(x => nonSelectedIdsOnly.includes(x.Id));

      //This is filter so that only 3 products are selected and then rest will be read only
      if (this.selectedSupplements.length < 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds.length = 0;
      }
      else if (this.selectedSupplements.length == 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds = nonSelectedIdsOnly;
      }
      else if (this.selectedSupplements.length > 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds = nonSelectedIdsOnly
      }

    }
    else if (event.checked == false && product != null && product != undefined) {

      //Operation
      if (this.selectedSupplements.length >= 1) {

        //If previously we have just added 3 products and removed a product
        if (this.selectedSupplements.length == 3) {
          this.closeSnackBar();
        }
        let currentProductIndex = this.selectedSupplements.map(x => x.Id).indexOf(product.Id);
        this.selectedSupplements.splice(currentProductIndex, 1);
      }


      //********************************************************* */
      this.productInternalOperation.varSelectedSupplements = this.selectedSupplements;

      let nonSelectedIdsOnly = this.supplementProductList.map(x => x.Id).filter(x => !this.selectedSupplements.map(x => x.Id).includes(x));
      this.nonSelectedProductList = this.supplementProductList.filter(x => nonSelectedIdsOnly.includes(x.Id));

      //This is filter so that only 3 products are selected and then rest will be read only
      if (this.selectedSupplements.length < 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds.length = 0;
      }
      else if (this.selectedSupplements.length == 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds = nonSelectedIdsOnly;
      }
      else if (this.selectedSupplements.length > 3) {
        this.selectedSupplementIds = this.selectedSupplements.map(x => x.Id);
        this.nonSelectedSupplementIds = nonSelectedIdsOnly
      }
    }

    this.productInternalOperation.varSelectedSupplements = this.selectedSupplements;
    this.productInternalOperation.UpdateSupplementProductInTempCart(this.selectedSupplements);
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

  CheckOutSupplement() {
    // window.location.href = '/payment/supplementproduct';
    // this._location.go('/payment/supplementproduct');

    // debugger;
    // this.productInternal.sendClickEvent_CallProductCheckOutAddressDetails();

    this.router.navigate(['/payment/supplementproduct']);
  }

}
