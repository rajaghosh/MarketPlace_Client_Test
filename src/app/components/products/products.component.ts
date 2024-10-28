import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../app/services/http-services/product.service';
import { ProductInternalService } from '../../../app/services/common-services/product-internal.service';
import { HomeInternalService } from '../../../app/services/common-services/home-internal.service';
import { ProductModel, ProductCartModel, ProductSubscriptionModel, CountryModel, ProductImageSlider, ProductColor, ProductSize, ProductAffliateDiscount } from '../../../app/models/product.model';
import { ProductCheckOutComponent } from '../products/product-check-out/product-check-out.component';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CheckoutDetails } from '../../models/checkout.model';
import * as $ from 'jquery';
import { NavigationEnd, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { ProductInternalOperationService } from '../../../app/services/common-services/product-internal-operation.service';
import { SubscriptionDialogComponent } from '../common/subscription-dialog/subscription-dialog.component';
import { Overlay } from '@angular/cdk/overlay';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})


export class ProductsComponent implements OnInit {

  resultDataList: ProductModel[];
  //adhocResultDataList: ProductModel[];
  isSubscriptionPlanCheck: boolean = true;

  currentProductName: string = "";
  currentProductPrice: string = "";
  currentSubscripion: ProductSubscriptionModel[];

  currentSubscripionShow: ProductSubscriptionModel[] = [];

  firstActualSubscriptionId: number | undefined = 0;
  selectedSubscription: ProductSubscriptionModel = {} as ProductSubscriptionModel;  //If we have an undefined then we will provide type assertion

  countryList: CountryModel[];
  isShowProductCatelog: boolean = false;
  isEmptyPageLoaded: number = 0;

  productDescriptionImages: ProductImageSlider[] = [];
  productDescriptionObj: ProductModel = {} as ProductModel;

  productColors: ProductColor[] = [];
  productSizes: ProductSize[] = [];

  selectedProductColors: ProductColor = {} as ProductColor;
  selectedProductSizes: ProductSize = {} as ProductSize;

  selectedProductColorId: string = "-1";
  selectedProductSizeId: string = "-1";

  currentProductForColorSize: ProductModel = {} as ProductModel;
  customLayoutVisible: boolean = false;

  isProductColorSizeButtonEnable: boolean = false;


  subscriptionMainProduct: ProductModel = {} as ProductModel;
  isSubcriptionOpenedFromDescription: boolean = false;

  isBestSellerShow: boolean = false;
  affliateCodeReceived: string = "";
  affliateDiscount: number = 0;

  aCode: string = "";

  //This click event subcription will receive event message / trigger when "check out" clicked at the header component
  clickEventsubscription_CallProductCheckOutAddressDetails: Subscription;

  constructor(
    private productService: ProductService,
    public productInternal: ProductInternalService,
    public homeInternal: HomeInternalService,
    public dialogToOpenProductCheckOut: MatDialog,
    private router: Router,
    private dialog: MatDialog,
    private productInternalOperation: ProductInternalOperationService,
    private overlay: Overlay,
    private route: ActivatedRoute
  ) {

    this.resultDataList = [];
    //this.adhocResultDataList = [];

    this.currentSubscripion = [];
    this.isShowProductCatelog = true;


    //This will restrict only Cart Check-Out Navigation to Payment CheckOut Page
    this.productInternal.varPaymentPageNavProtectVal = 0;

    this.clickEventsubscription_CallProductCheckOutAddressDetails =
      this.productInternal
        .getClickEvent_CallProductCheckOutAddressDetails()
        .subscribe(() => {
          this.OpenChildForProductCheckOut();
        });

    //Instantiation
    this.countryList = this.productInternal.varCountryListFromJson;

    this.getACode();

  }

  ngOnInit(): void {

    // document.body.scrollTop = 0;
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    $('html, body').animate({ scrollTop: 0 }, '300');

    let currentUrlParam: string = "All";




    let currentUrl: string = window.location.href;
    let currentParam: string[] = currentUrl.split("?");

    let currentCategoryId: number = 0;

    //If there is any autoship item list then that will be cleared - This is very important 
    //as we want if we move back to product page autoship item must be cleared
    this.productInternalOperation.FunctionCleanSupplementProductCartInLocalStorage();




    //Bestseller Search
    if (currentParam[1] != undefined && currentParam[1].trim().length > 0) {
      let categoryParamData: string[] = currentParam[1].split("=");
      let currentCategory = categoryParamData.filter(p => p.split("=")[0].toUpperCase() == "BESTSELLERS");

      if (currentCategory.length > 0) {
        // 
        this.isBestSellerShow = true;
      }
      //currentCategoryId = this.homeInternal.uriPageListingEnum.filter(p => p.Name.toUpperCase() == currentUrlParam.toUpperCase())[0]?.Id ?? 0;
    }

    //Category Search
    if (currentParam[1] != undefined && currentParam[1].trim().length > 0) {
      let categoryParamData: string[] = currentParam[1].split("&");
      let currentCategory = categoryParamData.filter(p => p.split("=")[0].toUpperCase() == "CATEGORY");

      if (currentCategory.length > 0) {
        currentUrlParam = currentCategory[0].split("=")[1];
      }
      currentCategoryId = this.homeInternal.uriPageListingEnum.filter(p => p.Name.toUpperCase() == currentUrlParam.toUpperCase())[0]?.Id ?? 0;
    }

    //Product Search
    let prodId: any;

    this.route.queryParams.subscribe(params => {
      prodId = params['product'];
      // prodval = params['param2'];
    });



    //if (currentParam[1] != undefined && currentParam[1].trim().length > 0 && currentCategoryId == 0) {
    //  let categoryParamData: string[] = currentParam[1].split("&");
    //  let currentProduct = categoryParamData.filter(p => p.split("=")[0].toUpperCase() == "PRODUCT");



    //  if (currentProduct.length > 0) {
    //    currentUrlParam = currentProduct[0].split("=")[1];
    //    prodId = Number(currentUrlParam);
    //  }

      // if (prodId > 0) {
      this.LoadProductDescriptionForModal(prodId);
      // }



    //}



    if (this.isBestSellerShow)
      this.ProductServiceBestSellerCall();
    else
      this.ProductServiceProductDetailsCall(null, currentCategoryId);

  }

  getACode() {
    if (localStorage.getItem("userCheckVal") != null)
      this.aCode = JSON.parse(localStorage.getItem("userCheckVal") ?? "");
    else
      this.aCode = "";
  }


  GoToTop() {
    document.body.scrollTop = 0;
  }

  GoToProductId(Id: number) {
    window.location.href = '/productlist?product=' + Id;
  }

  OpenChildForProductCheckOut() {


    if (!this.productInternal.varIsPaymentPageShowUsingChildComponent) {
      this.router.navigate(['payment/checkout']);
    }
    else {
      //Payment Page Show Using Child Component
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.maxHeight = '90%';
      dialogConfig.maxWidth = '100%';
      dialogConfig.position = {
        top: '5%',
        bottom: '5%'
      };
      dialogConfig.data = {

      };

      const dialog_OpenProductCheckOut = this.dialogToOpenProductCheckOut.open(ProductCheckOutComponent, dialogConfig);

      dialog_OpenProductCheckOut.afterClosed().subscribe(response => {
        //alert("Received Data from Child Component : " + data.description);
        this.productInternal.objCheckOutDetails = response;
        console.log(this.productInternal.objCheckOutDetails);
      });
    }
  }

  //#region ngAfterViewInit() - For native JS call
  ngAfterViewInit() {
    var btn = $('#back_button');

    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop();
      if (scrollTop != undefined && scrollTop > 300) {
        btn.addClass('show');
      } else {
        btn.removeClass('show');
      }
    });

    btn.on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, '300');
    });

    var btn2 = $('#check123');


  }
  //#endregion

  ProductServiceBestSellerCall() {
    try {
      const dialogRefPaymentInProgress = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Loading...",
          spinnerOn: true,
          confirmButtonText: '',
          buttonText: {
            ok: ''
          }
        }
      });

      this.isEmptyPageLoaded = 0; //this will show a blank page

      this.productService.getBestSellerProductsAsync().subscribe(s => {
        let result = s;
        this.resultDataList = result.Data;

        if (this.resultDataList.length <= 0) {
          this.isEmptyPageLoaded = 1; //this will show COMING SOON 
        }
        else {
          this.isEmptyPageLoaded = 2; //this will show PRODUCTS
        }

        dialogRefPaymentInProgress.close();


      });
    }
    catch (e) {
    }
  }

  //#region ProductServiceDataFetchCall
  ProductServiceProductDetailsCall(params: any, getFilter: number) {
    try {


      const dialogRefPaymentInProgress = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Loading...",
          spinnerOn: true,
          confirmButtonText: '',
          buttonText: {
            ok: ''
          }
        }
      });

      this.isEmptyPageLoaded = 0; //this will show a blank page

      this.productService.getProductsAsync(getFilter).subscribe(s => {
        let result = s;
        this.resultDataList = result.Data;

        if (this.resultDataList.length <= 0) {
          this.isEmptyPageLoaded = 1; //this will show COMING SOON 
        }
        else {
          this.isEmptyPageLoaded = 2; //this will show PRODUCTS
        }

        dialogRefPaymentInProgress.close();


      });
    }
    catch (e) {
    }

  }
  //#endregion

  ProductServiceGetProductColorSize(productId: number) {
    try {

      this.productService.getProductColorsSizesAsync(productId).subscribe(s => {

        let result = s;
        console.log(this.resultDataList);
      });
    }
    catch (e) {

    }
  }

  openLayerForProductColorSizeSelect() {
    this.customLayoutVisible = !this.customLayoutVisible;
  }

  OpenProductSizeColorSelector(currentProduct: ProductModel) {




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

    if (colorValue.length > 0 && colorValue != "Select an Option")
      this.selectedProductColors = this.productColors.filter(p => p.Name == colorValue)[0] ?? {} as ProductColor;
    else
      this.selectedProductColors = {} as ProductColor;
    this.CheckAndSetProductColorSizeButton();
  }

  UpdateProductSize(sizeValue: string) {

    if (sizeValue.length > 0 && sizeValue != "Select an Option")
      this.selectedProductSizes = this.productSizes.filter(p => p.Name == sizeValue)[0] ?? {} as ProductSize;
    else
      this.selectedProductSizes = {} as ProductSize;
    this.CheckAndSetProductColorSizeButton();
  }

  CheckAndSetProductColorSizeButton() {

    var colorSet: boolean = false;
    var sizeSet: boolean = false;
    if (this.selectedProductColors.Name != undefined)
      var colorSet = (this.selectedProductColors.Name.length > 0) ? true : false;
    if (this.selectedProductSizes.Name != undefined)
      var sizeSet = (this.selectedProductSizes.Name.length > 0) ? true : false;

    this.isProductColorSizeButtonEnable = colorSet && sizeSet;
  }

  UpdateProductColorSize() {

    console.log(this.selectedProductColorId);
    console.log(this.selectedProductSizeId);

    //Extract Value as Model
    this.selectedProductColors = this.productColors.filter(p => p.Id == this.selectedProductColorId)[0] ?? {} as ProductColor;
    this.selectedProductSizes = this.productSizes.filter(p => p.Id == this.selectedProductSizeId)[0] ?? {} as ProductColor;



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

  //#region GetCurrentProductUsingId()
  GetCurrentProductUsingId(productId: number): (ProductCartModel | undefined) {
    var currentProduct = this.productInternal.objProductsInCart.find(x => x.Product.Id == productId);
    return currentProduct;
  }
  //#endregion

  //#region ShowSubscriptions()
  ShowSubscriptions(product: ProductModel) {

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

    // this.currentSubscripionShow = this.currentSubscripion;

  }
  //#endregion

  //#region IsMainProductSubscription(), IsProductSubscription() - This Methods will be used to show the indicators for subscription listing
  IsMainProductSubscription(id: number) { //Present
    return id == 0 ? true : false;
  }

  IsProductSubscription(currentSubscriptionId: number) { //Present
    return (this.firstActualSubscriptionId == currentSubscriptionId) ? true : false;
  }
  //#endregion

  //#region SubmitSelectedSubscriptionToCart()
  SubmitSelectedSubscriptionToCart(product: ProductModel) {



    //This will be used for BUY NOW option for clothes - If no color or size is selected
    if (typeof this.selectedProductColors == 'object' && Object.keys(this.selectedProductColors).length === 0) {
      if (this.productColors != undefined && this.productColors.length > 0)
        this.selectedProductColors = this.productColors[0] ?? {} as ProductColor;
      else
        this.selectedProductColors = {} as ProductColor;
    }

    if (typeof this.selectedProductSizes == 'object' && Object.keys(this.selectedProductSizes).length === 0) {
      if (this.productSizes != undefined && this.productSizes.length > 0)
        this.selectedProductSizes = this.productSizes[0] ?? {} as ProductSize;
      else
        this.selectedProductSizes = {} as ProductSize;
      this.CheckAndSetProductColorSizeButton();
    }

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

  //This will be used for showing product description once model is updated
  // LoadProductDescriptionForModal(product: ProductModel) {
  async LoadProductDescriptionForModal(productId: number) {

    console.log(this.resultDataList);

    var product: ProductModel = {} as ProductModel;

    try {

      // debugger;

      //For affliate if present
      if (this.aCode != "") {

        let affliateIdExtracted = this.aCode;
        let affliateProdIdExtracted = productId;

        let strParam = affliateIdExtracted + "_" + affliateProdIdExtracted.toString();

        this.productInternalOperation.varAffliateDiscount = 0;
        this.productInternalOperation.varAffliateEmail = "";

        //For USE CASE
        //If in localstorage we have the affliateId 

        //Check if the userId is valid and the discount percent is valid
        this.productService.getValidationForAffliateUser(strParam).subscribe(d => {
          if (d.error == null || d.error == undefined) {

            // debugger;
            this.affliateDiscount = d.data.discount;
            let affliateEmailIdExtracted = d.data.email;

            this.productInternalOperation.varAffliateDiscount = this.affliateDiscount;
            this.productInternalOperation.varAffliateEmail = affliateEmailIdExtracted;

            localStorage.setItem("affliateEmail", JSON.stringify(affliateEmailIdExtracted));
          }
          else {
            this.productInternalOperation.varAffliateDiscount = 0;
            this.productInternalOperation.varAffliateEmail = "";

            localStorage.removeItem("affliateEmail");
          }
        });
      }
      else {
        localStorage.removeItem("affliateEmail");
      }


      this.productService.getProductByIdAsync(productId).subscribe(s => {

        let result = s;
        product = result.Data;

        this.isSubcriptionOpenedFromDescription = true;
        this.isShowProductCatelog = false;

        this.ShowSubscriptions(product);  //To show the list of subscription available
        this.productDescriptionObj = product;

        //Currently it is single image
        const imgA: ProductImageSlider = {
          path: this.productInternal.uriProductLocationCloud + this.productDescriptionObj.ImagePath,
        };
        this.productDescriptionImages.push(imgA);


      });
    }
    catch (e) {

    }

  }

  EnableProductCatelog() {
    this.isShowProductCatelog = true;
  }

  //Use this method to interpret html string is a single line
  toHTML(input: string): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }


  OpenSubscriptionDialog(product: ProductModel, selectedSubscription: ProductSubscriptionModel | undefined = undefined) {



    //this.productInternalOperation.AddProductToCart(product);

    this.productInternalOperation.varCurrentProduct = product;  //This is for direct
    this.productInternalOperation.varResultDataList = this.resultDataList;  //This is for subscription

    const dialogRefSubscriptionInProgress = this.dialog.open(SubscriptionDialogComponent, {
      disableClose: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(), //This will restrict the side scroll bar from apearing
      data: {
        message: "",
        spinnerOn: false,
        confirmButtonText: '',
        buttonText: {
          ok: ''
        },
        productFromCaller: product,
        selectedSubscriptionFromCaller: selectedSubscription,
        isSubscriptionAvailable: false,
        isColorSizeAvailable: false,
      }
    });

    //This is added for functionality continuation on Product Description Page
    dialogRefSubscriptionInProgress.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.currentSubscripion = this.productInternalOperation.varCurrentSubscripion;
        this.selectedSubscription = this.productInternalOperation.varSelectedSubscription;
      }
    });

  }

  DecodeAffliateLink(affliateEncodedLink: string) {
    return atob(decodeURIComponent(affliateEncodedLink));
  }


  CheckIfCodeIsValid(code: string) {
    let user = code.split("_")[0];
    let product = parseInt(code.split("_")[1]);


  }

  GetAffliateCodeAppliedPrice(actualAmount: number | undefined, affliateDiscount: number) {
    var amt = actualAmount ?? 0;
    return amt * (100 - affliateDiscount) / 100;
  }

}


