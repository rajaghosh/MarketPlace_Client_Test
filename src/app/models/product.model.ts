export interface ProductCartModel {
  Product: ProductModel;          //This will have the actual product info
  ProductCount: number;           //This will have the actual product count in cart
  SelectedSubscription: ProductSubscriptionModel | undefined;   //This will have the selected subscription (if any)
  SelectedProductPrice: number;   //This will have the product price (actual / discounted) to be shown in cart
  FinalAmount: number;            //This will have the final amount of the product units = ProductCount * SelectedProductPrice
  AffliateDiscount?: ProductAffliateDiscount | null; //This will hold any affliate discount
}

export interface CountryModel {
  Name: string;
  Value: string;
}

export interface ProductColorModel {
  Id: number;
  Name: string;
}

export interface ProductSizeModel {
  Id: number;
  Name: string;
}

export interface ProductImageSlider {
  path: string;
}

//THIS PRODUCT MODEL WILL STORE THE BASE PRODUCT DATA
export interface ProductModel {
  Id: number;
  InvoiceNo: string;
  IsChecked: boolean;
  Name: string;
  Quantity: number;
  Price: number;
  DisplayPrice: string;
  //productImage: File; //HttpPostedFileBase  
  ProductImage: any;
  ImagePath: string;
  ProductColors: ProductColor[];
  ProductSizes: ProductSize[];
  ProductSubscriptions: ProductSubscriptionModel[];
  SelectedColors: ProductColor[];
  SelectedSizes: ProductSize[];
  OrderColorId: number;
  OrderColorName: string;
  OrderSizeId: number;
  OrderSizeName: string;
  SelectedSubscription: ProductSubscriptionModel
  StockUnit: number;
  OrderById: number;
  ProductDesc: string;
  Ingredients: string;
  SuggestedUse: string;
  Warnings: string;
}

export interface ProductCategory {
  Id: number;
  Name: string;
}


export interface ProductColor {
  Id: string;
  Name: string;
}

export interface ProductSize {
  Id: string;
  Name: string;
}

export interface ProductSubscriptionModel {
  SubscriptionId: number;
  ProductList: SelectListItem[];
  ProductId: number;
  ProductNameList: string[];
  ProductName: string;
  CycleValue?: number;
  CycleType: string;
  Price?: number;
  DisplayPrice: number;
  DiscountPercentage: number;
  DiscountAmount: number;
  CreatedDate?: Date;
  UpdatedDate?: Date;
  IsActive: boolean
}

export interface SelectListItem {
  Disabled: boolean;
  Group: SelectListGroup;
  Selected: boolean;
  Text: string;
  Value: string;
}

export interface SelectListGroup {
  Disabled: boolean;
  Name: string;
}

export interface PromoCodeModel {
  Id: number;
  PromoName: string;
  PromoPercent?: number;
  StartDate?: Date;
  EndDate?: Date;
  IsActive: boolean;
  TotalAmount: number;
}

export interface PaymentResponseModel {
  IsSuccess: boolean;
  Message: string;
}

export interface ProductAffliateDiscount {
  ProductId: number;
  AffliateDiscount: number;
  AffliateEmail: string;
}


export interface ProductAffliatePaymentModel {
  ProductId: number;
  ProductCount: number;           
  SelectedProductPrice: number;
  FinalAmount: number;
  AffliateDiscount?: ProductAffliateDiscount | null;
}