import { Injectable } from '@angular/core';
import { ProductAffliateDiscount, ProductCartModel, ProductColor, ProductModel, ProductSize, ProductSubscriptionModel } from 'src/app/models/product.model';
import { ProductInternalService } from './product-internal.service';

@Injectable({
  providedIn: 'root'
})
export class ProductInternalOperationService {

  varSelectedProductColors: ProductColor = {} as ProductColor;
  varSelectedProductSizes: ProductSize = {} as ProductSize;

  varIsSubcriptionOpenedFromDescription: boolean = false;
  varSubscriptionMainProduct: ProductModel = {} as ProductModel;
  varCurrentProductName: string = "";
  varCurrentProductPrice: string = "";
  varCurrentSubscripion: ProductSubscriptionModel[] = [];
  varFirstActualSubscriptionId: number | undefined = 0;

  varProductColors: ProductColor[] = [];
  varProductSizes: ProductSize[] = [];
  varSelectedSubscription: ProductSubscriptionModel = {} as ProductSubscriptionModel;

  varCurrentProduct: ProductModel = {} as ProductModel;

  varResultDataList: ProductModel[] = [];
  varSelectedSupplements: ProductModel[] = [];

  varAffliateDiscount: number = 0;
  varAffliateEmail: string = "";
  varProdAffliateDiscount: ProductAffliateDiscount[] = [];

  constructor(public productInternal: ProductInternalService) { }


  CalculateAffliateDiscount(productId: number) {
    // USE CASE
    // 1. IF CODE VALID AND OF CURRENT PRODUCT - IMPLEMENTED
    // 2. IF CODE VALID AND OF DIFF. PRODUCT - IMPLEMENTED
    // 3. IF CODE VALID BUT EXPIRED - IMPLEMENTED
    // 4. IF CODE INVALID - IMPLEMENTED
    // 5. IF NO CODE USED - IMPLEMENTED



    var currentProd = this.varProdAffliateDiscount.filter(p => p.ProductId == productId);
    if (currentProd.length == 0) //Current Product Not Present
    {
      let prodAddDis: ProductAffliateDiscount = {
        ProductId: productId,
        AffliateDiscount: this.varAffliateDiscount,
        AffliateEmail: this.varAffliateEmail
      };
      this.varProdAffliateDiscount.push(prodAddDis);
    }
    else //Current Product Present - Then disable current and reinsert
    {
      //Make object unusable and push again - this ensures we will always have the latest info from API
      this.varProdAffliateDiscount
        .filter(p => p.ProductId == productId).forEach(p => { p.ProductId = 0; });

      let prodAddDis: ProductAffliateDiscount = {
        ProductId: productId,
        AffliateDiscount: this.varAffliateDiscount,
        AffliateEmail: this.varAffliateEmail
      };

      this.varProdAffliateDiscount.push(prodAddDis);
    }


  }



  //#region AddProductToCart()
  AddProductToCart(currentProduct: ProductModel, selectedSubscription: ProductSubscriptionModel | undefined = undefined) {

    // debugger;

    this.CalculateAffliateDiscount(currentProduct.Id);

    var tempProdColorList: ProductColor[] = [];
    var tempProdSizeList: ProductSize[] = [];

    if (currentProduct.SelectedColors != undefined && currentProduct.SelectedColors.length > 0) {

      tempProdColorList.push(this.varSelectedProductColors);
    }

    if (currentProduct.SelectedSizes != undefined && currentProduct.SelectedSizes.length > 0) {

      tempProdSizeList.push(this.varSelectedProductSizes);
    }

    // debugger;
    //If the cart is empty then we need to load cart data from local storage
    if (this.productInternal.objCheckOutProductList.length == 0) {
      this.productInternal.FuncGetCartDataFromLocalStorage();

      this.productInternal.objCheckOutProductList = this.productInternal.objProductsInCart;
    }

    let currentProductCountInCart: ProductCartModel | undefined;

    if ((tempProdColorList != undefined && tempProdColorList.length > 0)
      && (tempProdSizeList != undefined && tempProdSizeList.length > 0)) {

      currentProductCountInCart = this.productInternal.objCheckOutProductList
        .find(x => x.Product.Id == currentProduct.Id
          && (x.Product.ProductColors != undefined || x.Product.ProductColors != null) && x.Product.ProductColors[0]?.Id == tempProdColorList[0]?.Id
          && (x.Product.ProductSizes != undefined || x.Product.ProductSizes != null) && x.Product.ProductSizes[0]?.Id == tempProdSizeList[0]?.Id);
    } else {
      currentProductCountInCart = this.productInternal.objCheckOutProductList
        .find(x => x.Product.Id == currentProduct.Id);
    }

    var currentAffliateProd = this.varProdAffliateDiscount.filter(p => p.ProductId == currentProduct.Id);

    //Check if the product is already there in the cart - Update
    if (currentProductCountInCart != undefined && currentProductCountInCart.ProductCount > 0) {

      //debugger;

      if ((tempProdColorList != undefined && tempProdColorList.length > 0)
        && (tempProdSizeList != undefined && tempProdSizeList.length > 0)) {

        currentProduct.ProductColors = tempProdColorList;
        currentProduct.ProductSizes = tempProdSizeList;
      }

      let currnetProductIndex = this.productInternal.objCheckOutProductList.indexOf(currentProductCountInCart);
      let currentCheckoutProduct: ProductCartModel = this.productInternal.objCheckOutProductList[currnetProductIndex];

      let subscriptionForUpdate: ProductSubscriptionModel | undefined = undefined;

      //Check whether we have price from subscription
      if (selectedSubscription != undefined && selectedSubscription.SubscriptionId >= 0) {
        subscriptionForUpdate = selectedSubscription;
      }

      let currentProductPriceUpdate: number
        = (subscriptionForUpdate != undefined && subscriptionForUpdate.SubscriptionId > 0) ?
          Number(this.productInternal.FuncGetDiscountedPrice(subscriptionForUpdate.DisplayPrice, subscriptionForUpdate.DiscountPercentage))
          : currentProduct.Price;

      //If subscription model changed then we would not increase the quantity
      let isSubcriptionPriceChanged: boolean = currentCheckoutProduct.SelectedProductPrice != currentProductPriceUpdate ? true : false;

      //If any valid affliate discount available we will update that
      // if (this.varAffliateDiscount != 0) {
      //   currentProductPriceUpdate = currentProductPriceUpdate * (100 - this.varAffliateDiscount) / 100;
      // }

      let isAffliateDiscount: boolean = false;

      if ((currentAffliateProd != null || currentAffliateProd != undefined)
        && currentAffliateProd.length > 0) {

        currentProductPriceUpdate = currentProductPriceUpdate * (100 - currentAffliateProd[0].AffliateDiscount) / 100;
        isAffliateDiscount = true;
      }

      // debugger;

      let currentCartUpdate: ProductCartModel =
      {
        Product: currentProduct,
        ProductCount: isSubcriptionPriceChanged ? currentProductCountInCart.ProductCount : currentProductCountInCart.ProductCount + 1,
        SelectedSubscription: subscriptionForUpdate, //If we have an undefined then we will provide type assertion
        SelectedProductPrice: currentProductPriceUpdate,
        FinalAmount: currentProductPriceUpdate * (isSubcriptionPriceChanged ? currentProductCountInCart.ProductCount : currentProductCountInCart.ProductCount + 1),
        AffliateDiscount: isAffliateDiscount ? currentAffliateProd[0] : null
      };

      //If we have Subscription
      if (selectedSubscription != undefined) {
        currentCartUpdate.ProductCount = 1;
        currentCartUpdate.FinalAmount = currentProductPriceUpdate;
      }

      this.productInternal.objCheckOutProductList[currnetProductIndex] = currentCartUpdate;

    }
    //If Product is not in the cart then add the product and increase the count by 1 - Insert
    else {
      //debugger;

      let tempCurrentProduct: ProductModel = {} as ProductModel;

      tempCurrentProduct = Object.assign({}, currentProduct);  //Shallow Copy - Important 

      if ((tempProdColorList != undefined && tempProdColorList.length > 0)
        && (tempProdSizeList != undefined && tempProdSizeList.length > 0)) {
        tempCurrentProduct.ProductColors = tempProdColorList;
        tempCurrentProduct.ProductSizes = tempProdSizeList;
      }

      //If we have subscription then we will take the subscription amount else the product amount
      let currentProductPriceInsert: number
        = (selectedSubscription != undefined && selectedSubscription.SubscriptionId > 0) ?
          Number(this.productInternal.FuncGetDiscountedPrice(selectedSubscription.DisplayPrice, selectedSubscription.DiscountPercentage))
          : tempCurrentProduct.Price

      // //If any valid affliate discount available we will update that
      // if (this.varAffliateDiscount != 0) {
      //   currentProductPriceInsert = currentProductPriceInsert * (100 - this.varAffliateDiscount) / 100;
      // }

      let isAffliateDiscount: boolean = false;

      if ((currentAffliateProd != null || currentAffliateProd != undefined)
        && currentAffliateProd.length > 0) {

        currentProductPriceInsert = currentProductPriceInsert * (100 - currentAffliateProd[0].AffliateDiscount) / 100;
        isAffliateDiscount = true;
      }

      // debugger;

      let currentCartAdd: ProductCartModel =
      {
        Product: tempCurrentProduct,
        ProductCount: 1,
        SelectedSubscription: selectedSubscription, //If we have a subscription ,
        SelectedProductPrice: currentProductPriceInsert,
        FinalAmount: currentProductPriceInsert * 1,
        AffliateDiscount: isAffliateDiscount ? currentAffliateProd[0] : null
      };

      this.productInternal.objCheckOutProductList.push(currentCartAdd);
    }

    //debugger;

    //Sharing data using internal service properties
    this.productInternal.varProductCount = this.productInternal.objCheckOutProductList.length;  //Count of Products in the Cart
    this.productInternal.objProductsInCart = this.productInternal.objCheckOutProductList;       //Details of Products in the Cart

    this.productInternal.FuncCheckOutButtonEnableDisable(true); //Sending true if we are calling it when adding product

    this.productInternal.FuncUpdateTotalProductPriceAndCountInCart(); //This will update the total amount of the cart

    this.productInternal.FuncSetCartDataToLocalStorage();

  }
  //#endregion

  //#region ShowSubscriptions()
  ShowSubscriptions(product: ProductModel) {

    //debugger;

    this.varIsSubcriptionOpenedFromDescription = true;
    this.varSubscriptionMainProduct = product;

    this.varCurrentProductName = this.productInternal.FuncGetNamePartFromNameString(product.Name.trim());
    this.varCurrentProductPrice = this.productInternal.FuncGetPricePartFromNameString(product.Name.trim());

    this.varCurrentSubscripion.splice(0, this.varCurrentSubscripion.length); //List Clear
    this.varCurrentSubscripion = Array.from(product.ProductSubscriptions); //Copy like this - Else there might be reference copy

    this.varFirstActualSubscriptionId = product.ProductSubscriptions.find(x => x.SubscriptionId)?.SubscriptionId;

    this.varProductColors = product.SelectedColors;
    this.varProductSizes = product.SelectedSizes;

    let originalProduct: ProductSubscriptionModel = {
      SubscriptionId: 0, //This is for the original one
      ProductList: [],
      ProductId: product.Id,
      ProductNameList: [],
      ProductName: product.Name,
      CycleValue: 0,
      CycleType: "",
      Price: product.Price,
      DisplayPrice: product.Price,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      CreatedDate: undefined,
      UpdatedDate: undefined,
      IsActive: false
    };

    //This will push the parent Product Data in Subscription List at the top
    this.varCurrentSubscripion.reverse();
    this.varCurrentSubscripion.push(originalProduct);
    this.varCurrentSubscripion.reverse();

    //This will make the original value as default selected subscription
    this.varSelectedSubscription = originalProduct;
  }
  //#endregion

  Fn_QuantityMinus(productId: number, productColors: ProductColor[] | undefined | null, productSizes: ProductSize[] | undefined | null) {
    var currentProduct = this.GetCurrentProductUsingId(productId, productColors, productSizes);
    if (currentProduct != undefined && currentProduct.ProductCount > 1) {
      this.UpdateProductCountInCart(currentProduct, "minus", currentProduct.SelectedSubscription);
    }
    this.productInternal.FuncUpdateTotalProductPriceAndCountInCart();
  }

  Fn_QuantityPlus(productId: number, productColors: ProductColor[] | undefined | null, productSizes: ProductSize[] | undefined | null) {
    var currentProduct = this.GetCurrentProductUsingId(productId, productColors, productSizes);
    if (currentProduct != undefined && currentProduct.ProductCount >= 0) {
      this.UpdateProductCountInCart(currentProduct, "plus", currentProduct.SelectedSubscription);
    }

    this.productInternal.FuncUpdateTotalProductPriceAndCountInCart();
  }

  Fn_DeleteProduct(productId: number, productColors: ProductColor[] | undefined | null, productSizes: ProductSize[] | undefined | null) {
    var currentProduct = this.GetCurrentProductUsingId(productId, productColors, productSizes);
    if (currentProduct != undefined && currentProduct.ProductCount >= 0) {
      this.UpdateProductCountInCart(currentProduct, "remove", currentProduct.SelectedSubscription);
    }
    this.productInternal.FuncCheckOutButtonEnableDisable();
    this.productInternal.FuncUpdateTotalProductPriceAndCountInCart();
  }


  GetCurrentProductUsingId(productId: number, productColors: ProductColor[] | undefined | null, productSizes: ProductSize[] | undefined | null)
    : (ProductCartModel | undefined) {

    var currentProduct: ProductCartModel | undefined;

    if ((productColors != undefined && productColors != null && productColors.length > 0)
      && (productSizes != undefined && productSizes != null && productSizes.length > 0)) {

      currentProduct = this.productInternal.objProductsInCart.find(x => x.Product.Id == productId
        && (x.Product.ProductColors != undefined || x.Product.ProductColors != null) && x.Product.ProductColors[0]?.Id == productColors[0]?.Id
        && (x.Product.ProductSizes != undefined || x.Product.ProductSizes != null) && x.Product.ProductSizes[0]?.Id == productSizes[0]?.Id);


    } else {

      currentProduct = this.productInternal.objProductsInCart.find(x => x.Product.Id == productId);
    }

    // var currentProduct = this.productInternal.objProductsInCart.find(x => x.Product.Id == productId);
    return currentProduct;
  }


  //#region UpdateProductCountInCart()
  UpdateProductCountInCart(currentProduct: ProductCartModel, operation: string, selectedSubscription: ProductSubscriptionModel | undefined = undefined) {

    //If any valid affliate discount available we will update that
    // if (this.varAffliateDiscount != 0) {
    //   currentProductPriceInsert = currentProductPriceInsert * (100 - this.varAffliateDiscount) / 100;
    // }
    // debugger;

    let currnetProductIndex = this.productInternal.objProductsInCart.indexOf(currentProduct);

    //-----------------------------------------------------------------------------------------

    let currentCheckoutProduct: ProductCartModel = this.productInternal.objProductsInCart[currnetProductIndex];

    let subscriptionForUpdate: ProductSubscriptionModel | undefined = undefined;

    //Check whether we have price from subscription
    if (currentCheckoutProduct.SelectedSubscription != undefined && currentCheckoutProduct.SelectedSubscription.SubscriptionId >= 0) {
      subscriptionForUpdate = currentCheckoutProduct.SelectedSubscription;
    }

    let currentProductPriceUpdate: number
      = (subscriptionForUpdate != undefined && subscriptionForUpdate.SubscriptionId > 0) ?
        Number(this.productInternal.FuncGetDiscountedPrice(subscriptionForUpdate.DisplayPrice, subscriptionForUpdate.DiscountPercentage))
        : currentProduct.Product.Price;

    //-----------------------------------------------------------------------------------------

    let isAffliateDiscount: boolean = false;
    let currentAffliateProd = currentProduct.AffliateDiscount;
    if (currentAffliateProd != null || currentAffliateProd != undefined) {

      currentProductPriceUpdate = currentProductPriceUpdate * (100 - currentAffliateProd.AffliateDiscount) / 100;
      isAffliateDiscount = true;
    }


    if (operation == "plus") {
      this.productInternal.objProductsInCart[currnetProductIndex] =
      {
        Product: currentProduct.Product,
        ProductCount: currentProduct.ProductCount + 1,
        SelectedSubscription: subscriptionForUpdate,
        SelectedProductPrice: currentProductPriceUpdate,
        FinalAmount: currentProductPriceUpdate * (currentProduct.ProductCount + 1),
        AffliateDiscount : isAffliateDiscount ? currentAffliateProd : null
      };

    }
    else if (operation == "minus") {
      this.productInternal.objProductsInCart[currnetProductIndex] =
      {
        Product: currentProduct.Product,
        ProductCount: currentProduct.ProductCount - 1,
        SelectedSubscription: subscriptionForUpdate,
        SelectedProductPrice: currentProductPriceUpdate,
        FinalAmount: currentProductPriceUpdate * (currentProduct.ProductCount - 1),
        AffliateDiscount : isAffliateDiscount ? currentAffliateProd : null
      };
    }
    else if (operation == "remove") {
      this.productInternal.objProductsInCart.splice(currnetProductIndex, 1);
      this.productInternal.varProductCount = this.productInternal.objProductsInCart.length;
      this.productInternal.varIsCartEmpty = this.productInternal.varProductCount == 0 ? true : false;
    }

    //Both represents same but used differently. So we synced up.
    this.productInternal.objCheckOutProductList = this.productInternal.objProductsInCart;

    this.productInternal.FuncSetCartDataToLocalStorage();

  }
  //#endregion

  AddSupplementProductInTempCart(productList: ProductModel[] | undefined | null) {

    if (productList != undefined && productList != null) {
      // && productList.length == 3) {

      productList.forEach(currentProduct => {
        let currentCart: ProductCartModel =
        {
          Product: currentProduct,
          ProductCount: 1,
          SelectedSubscription: undefined,
          SelectedProductPrice: currentProduct.Price,
          FinalAmount: 0
        };
        this.productInternal.objCheckOutSupplementProductList.push(currentCart);
      });
    }

    this.FunctionSetSupplementProductCartInLocalStorage();
  }

  UpdateSupplementProductInTempCart(productList: ProductModel[] | undefined | null) {


    //Need to clean data then Add
    this.productInternal.objCheckOutSupplementProductList.length = 0;

    if (productList != undefined && productList != null) {
      //  && productList.length == 3) {

      //Basically we are updating 
      productList.forEach(currentProduct => {
        let currentCart: ProductCartModel =
        {
          Product: currentProduct,
          ProductCount: 1,
          SelectedSubscription: undefined,
          SelectedProductPrice: currentProduct.Price,
          FinalAmount: 0
        };
        this.productInternal.objCheckOutSupplementProductList.push(currentCart);
      });

    }

    this.FunctionSetSupplementProductCartInLocalStorage();
  }



  FunctionCleanSupplementProductCartInLocalStorage() {
    if (localStorage.getItem("cartSupplementData") !== null) {
      localStorage.removeItem("cartSupplementData");
    }

    this.varSelectedSupplements.length = 0;
    this.FunctionGetSupplementProductCartInLocalStorage();
  }

  FunctionSetSupplementProductCartInLocalStorage() {
    if (localStorage.getItem("cartSupplementData") !== null) {
      localStorage.removeItem("cartSupplementData");
    }

    localStorage.setItem("cartSupplementData", JSON.stringify(this.productInternal.objCheckOutSupplementProductList));
  }

  FunctionGetSupplementProductCartInLocalStorage() {
    //debugger;
    if (localStorage.getItem("cartSupplementData") !== null) {
      this.productInternal.objCheckOutSupplementProductList
        = JSON.parse(localStorage.getItem("cartSupplementData") ?? "false") as ProductCartModel[];

      this.varSelectedSupplements = this.productInternal?.objCheckOutSupplementProductList?.map(x => x.Product);
    }
    else {
      this.productInternal.objCheckOutSupplementProductList = [];
    }

  }

}
