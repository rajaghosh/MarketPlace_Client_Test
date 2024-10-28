import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductColor, ProductModel, ProductSize, ProductSubscriptionModel } from '../../../models/product.model';
import { ProductInternalOperationService } from '../../../services/common-services/product-internal-operation.service';
import { ProductInternalService } from '../../../services/common-services/product-internal.service';
// declare var $: any;

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.css']
})

export class SubscriptionDialogComponent implements OnInit {

  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  spinnerOn: boolean = false;

  productFromCaller: ProductModel = {} as ProductModel;
  selectedSubscriptionFromCaller: ProductSubscriptionModel | undefined = undefined;

  isSubscriptionAvailable = false;
  isColorSizeAvailable = false;

  selectedProductColors: ProductColor = {} as ProductColor;
  selectedProductSizes: ProductSize = {} as ProductSize;

  resultDataList: ProductModel[] = [];

  isSubcriptionOpenedFromDescription: boolean = false;
  subscriptionMainProduct: ProductModel = {} as ProductModel;
  currentProductName: string = "";
  currentProductPrice: string = "";
  currentSubscripion: ProductSubscriptionModel[] = [];
  firstActualSubscriptionId: number | undefined = 0;

  productColors: ProductColor[] = [];
  productSizes: ProductSize[] = [];
  selectedSubscription: ProductSubscriptionModel = {} as ProductSubscriptionModel;

  element1: HTMLElement = {} as HTMLElement;

  isNormalCartControl: boolean = false;
  isSubscriptionControl: boolean = false;
  isColorSizeControl: boolean = false;


  isProductColorSizeButtonEnable = false;
  currentProductForColorSize: ProductModel = {} as ProductModel;

  // @ViewChild('justCartOpen') justCartOpen: ElementRef<HTMLElement> = {} as ElementRef<HTMLElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<SubscriptionDialogComponent>,
    public productInternal: ProductInternalService,
    private productInternalOperation: ProductInternalOperationService
  ) {

    //debugger;
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel;
      }
      if (data.spinnerOn !== undefined && data.spinnerOn) {
        this.spinnerOn = true;
      }

      this.productFromCaller = data.productFromCaller;
      this.selectedSubscriptionFromCaller = data.selectedSubscriptionFromCaller;

      this.isSubscriptionAvailable = data.isSubscriptionAvailable;
      this.isColorSizeAvailable = data.isColorSizeAvailable;

      //CASE 1 - IF THERE IS NO AVAILABLE SIZE OR COLOR + NO SUBSCRIPTION
      if (!(this.productFromCaller.ProductSubscriptions.length > 0)
        && !(this.productFromCaller.SelectedColors.length > 0 || this.productFromCaller.SelectedSizes.length > 0)) {

        this.isSubscriptionAvailable = false;
        this.isColorSizeAvailable = false;
      }
      if ((this.productFromCaller.ProductSubscriptions.length > 0)
        && !(this.productFromCaller.SelectedColors.length > 0 || this.productFromCaller.SelectedSizes.length > 0)) {

        this.isSubscriptionAvailable = true;
        this.isColorSizeAvailable = false;
      }
      if (!(this.productFromCaller.ProductSubscriptions.length > 0)
        && (this.productFromCaller.SelectedColors.length > 0 || this.productFromCaller.SelectedSizes.length > 0)) {

        this.isSubscriptionAvailable = false;
        this.isColorSizeAvailable = true;
      }
      if ((this.productFromCaller.ProductSubscriptions.length > 0)
        && (this.productFromCaller.SelectedColors.length > 0 || this.productFromCaller.SelectedSizes.length > 0)) {

        this.isSubscriptionAvailable = true;
        this.isColorSizeAvailable = true;
      }


      //this.isNormalCartControl = true;

    }
  }

  ngOnInit(): void {
    // debugger;


    this.element1 = document.getElementById('auto_trigger') as HTMLElement;

    this.GetSubscriptionCondition(this.productFromCaller, this.selectedSubscriptionFromCaller);
    // this.OpenSubscriptionCondition();

  }

  GetSubscriptionCondition(product: ProductModel, selectedSubscription: ProductSubscriptionModel | undefined = undefined) {

    //debugger;

    //Case 1 - !SUBSCRIPTION + !PRODUCT SIZE COLOR
    if (this.isSubscriptionAvailable == false && this.isColorSizeAvailable == false) {
      this.AddProductToCart(product);
      this.CloseDialog();
      this.OpenSubscriptionCondition();
    }
    //Case 2 - SUBSCRIPTION + !PRODUCT SIZE COLOR
    else if (this.isSubscriptionAvailable == true && this.isColorSizeAvailable == false) {

      this.ShowSubscriptions(product);

      this.OpenSubscriptionCondition();
    }
    //Case 3 - !SUBSCRIPTION + PRODUCT SIZE COLOR
    else if (this.isSubscriptionAvailable == false && this.isColorSizeAvailable == true) {
      this.OpenSubscriptionCondition();
    }
    //Case 4 - SUBSCRIPTION + PRODUCT SIZE COLOR
    else if (this.isSubscriptionAvailable == true && this.isColorSizeAvailable == true) {
      this.OpenSubscriptionCondition();
    }

  }

  OpenSubscriptionCondition() {
    //debugger;

    //Case 1 - !SUBSCRIPTION + !PRODUCT SIZE COLOR
    if (this.isSubscriptionAvailable == false && this.isColorSizeAvailable == false) {

      this.isNormalCartControl = true;
      this.isSubscriptionControl = false;
      this.isColorSizeControl = false;

      this.element1.click();
    }
    //Case 2 - SUBSCRIPTION + !PRODUCT SIZE COLOR
    else if (this.isSubscriptionAvailable == true && this.isColorSizeAvailable == false) {

      //We need to invoke all the shared data for ShowSubscriptions
      this.isSubcriptionOpenedFromDescription = this.productInternalOperation.varIsSubcriptionOpenedFromDescription;
      this.subscriptionMainProduct = this.productInternalOperation.varSubscriptionMainProduct;
      this.currentProductName = this.productInternalOperation.varCurrentProductName;
      this.currentProductPrice = this.productInternalOperation.varCurrentProductPrice;
      this.currentSubscripion = this.productInternalOperation.varCurrentSubscripion;
      this.firstActualSubscriptionId = this.productInternalOperation.varFirstActualSubscriptionId;
      this.productColors = this.productInternalOperation.varProductColors;
      this.productSizes = this.productInternalOperation.varProductSizes;
      this.selectedSubscription = this.productInternalOperation.varSelectedSubscription;


      console.log(this.currentSubscripion);

      this.isNormalCartControl = false;
      this.isSubscriptionControl = true;
      this.isColorSizeControl = false;

      // console.log("Open Subscription");
      // console.log(this.selectedSubscription);
    }
    //Case 3 - !SUBSCRIPTION + PRODUCT SIZE COLOR
    else if (this.isSubscriptionAvailable == false && this.isColorSizeAvailable == true) {

      this.OpenProductSizeColorSelector(this.productInternalOperation.varCurrentProduct);

      this.isNormalCartControl = false;
      this.isSubscriptionControl = false;
      this.isColorSizeControl = true;

      // console.log("Open Color and Size");
    }
    //Case 4 - SUBSCRIPTION + PRODUCT SIZE COLOR
    else if (this.isSubscriptionAvailable == true && this.isColorSizeAvailable == true) {

      this.OpenProductSizeColorSelector(this.productInternalOperation.varCurrentProduct);

      this.subscriptionMainProduct = this.productInternalOperation.varSubscriptionMainProduct;
      this.isSubcriptionOpenedFromDescription = this.productInternalOperation.varIsSubcriptionOpenedFromDescription;

      this.isNormalCartControl = false;
      this.isSubscriptionControl = false;
      this.isColorSizeControl = true;

      // console.log("Open Color and Size then Subscriptoion");
    }


  }



  OpenSubscriptionDialogAfterColorSizeSelect(currentProduct: ProductModel) {

    //debugger;
    this.ShowSubscriptions(currentProduct);

    this.resultDataList = this.productInternalOperation.varResultDataList;

    // this.currentSubscripion = this.productInternalOperation.varCurrentSubscripion;
    console.log(this.currentSubscripion);

    this.isNormalCartControl = false;
    this.isSubscriptionControl = true;
    this.isColorSizeControl = false;
  }

  //#region AddProductToCart()
  AddProductToCart(currentProduct: ProductModel, selectedSubscription: ProductSubscriptionModel | undefined = undefined) {

    //Before operation store to shared service
    this.productInternalOperation.varSelectedProductColors = this.selectedProductColors;
    this.productInternalOperation.varSelectedProductSizes = this.selectedProductSizes;

    this.productInternalOperation.AddProductToCart(currentProduct, selectedSubscription);

    //After operation retrieve from shared service
    this.selectedProductColors = this.productInternalOperation.varSelectedProductColors
    this.selectedProductSizes = this.productInternalOperation.varSelectedProductSizes;

  }
  //#endregion

  //#region ShowSubscriptions()
  ShowSubscriptions(product: ProductModel) {

    //debugger;
    this.productInternalOperation.ShowSubscriptions(product);

    this.isSubcriptionOpenedFromDescription = this.productInternalOperation.varIsSubcriptionOpenedFromDescription;
    this.subscriptionMainProduct = this.productInternalOperation.varSubscriptionMainProduct;
    this.currentProductName = this.productInternalOperation.varCurrentProductName;
    this.currentProductPrice = this.productInternalOperation.varCurrentProductPrice;
    this.currentSubscripion = this.productInternalOperation.varCurrentSubscripion;
    this.firstActualSubscriptionId = this.productInternalOperation.varFirstActualSubscriptionId;
    this.productColors = this.productInternalOperation.varProductColors;
    this.productSizes = this.productInternalOperation.varProductSizes;
    this.selectedSubscription = this.productInternalOperation.varSelectedSubscription;

  }
  //#endregion


  isDisplayCancelButton() {
    if (this.cancelButtonText != "") {
      return true;
    }
    else {
      return false;
    }
  }

  isDisplayOKButton() {
    if (this.data.confirmButtonText != "") {
      return true;
    }
    else {
      return false;
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  //#region SubmitSelectedSubscriptionToCart()
  SubmitSelectedSubscriptionToCart(product: ProductModel) {

    //debugger;
    this.resultDataList = this.productInternalOperation.varResultDataList;

    //Get the product details
    if (this.selectedSubscription != undefined && this.selectedSubscription.CycleValue != 0) {
      let selectedSubscription = this.selectedSubscription;

      var productDetailsFetched: ProductModel = {} as ProductModel;

      //If we get the product by subscription then its the subscription else the main product
      productDetailsFetched
        = this.resultDataList.find(p => p.ProductSubscriptions.includes(selectedSubscription))
        ?? this.resultDataList.find(p => p.Id == selectedSubscription.ProductId)
        ?? productDetailsFetched;

      this.AddProductToCart(productDetailsFetched, selectedSubscription);
    }
    else {
      this.AddProductToCart(product)
    }
  }
  //#endregion




  IsMainProductSubscription(id: number) { //Present
    return id == 0 ? true : false;
  }

  CheckAndSetProductColorSizeButton() {

    this.isProductColorSizeButtonEnable = false;

    var colorSet: boolean = false;
    var sizeSet: boolean = false;
    if (this.selectedProductColors.Name != undefined)
      var colorSet = (this.selectedProductColors.Name.length > 0) ? true : false;
    if (this.selectedProductSizes.Name != undefined)
      var sizeSet = (this.selectedProductSizes.Name.length > 0) ? true : false;

    this.isProductColorSizeButtonEnable = colorSet && sizeSet;
  }

  OpenProductSizeColorSelector(currentProduct: ProductModel) {

    //debugger;

    var selectedColorList: ProductColor[] = [];
    selectedColorList.length = 0;
    selectedColorList.push({ "Id": "0", "Name": "Select an Option" } as ProductColor);
    selectedColorList.push(...currentProduct.SelectedColors);
    this.productColors = selectedColorList;

    var selectedSizeList: ProductSize[] = [];
    selectedSizeList.length = 0;
    selectedSizeList.push({ "Id": "0", "Name": "Select an Option" } as ProductSize);
    selectedSizeList.push(...currentProduct.SelectedSizes);
    this.productSizes = selectedSizeList;

    this.currentProductForColorSize = currentProduct;
  }



  UpdateProductColor(colorValue: string) {

    // debugger;
    colorValue = colorValue.trim();

    if (colorValue.length > 0 && colorValue != "Select an Option")
      this.selectedProductColors = this.productColors.filter(p => p.Name == colorValue)[0] ?? {} as ProductColor;
    else
      this.selectedProductColors = {} as ProductColor;
    this.CheckAndSetProductColorSizeButton();
  }


  UpdateProductSize(sizeValue: string) {

    // debugger;
    sizeValue = sizeValue.trim();

    if (sizeValue.length > 0 && sizeValue != "Select an Option")
      this.selectedProductSizes = this.productSizes.filter(p => p.Name == sizeValue)[0] ?? {} as ProductSize;
    else
      this.selectedProductSizes = {} as ProductSize;
    this.CheckAndSetProductColorSizeButton();
  }


  GoToProductId(Id: number) {
    window.location.href = '/productlist?product=' + Id;
  }

  CloseDialog(): void {
    this.dialogRef.close(true);
  }

  CloseColorSizeDialog(product: ProductModel): void {

    if (this.isProductColorSizeButtonEnable)
      this.AddProductToCart(product);
    this.dialogRef.close(true);
  }

  CloseAfterSubscriptionSelection(product: ProductModel): void {

    this.SubmitSelectedSubscriptionToCart(product);
    this.dialogRef.close(true);
  }


}
