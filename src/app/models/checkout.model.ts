// import { get } from "jquery";
import { ProductModel, SelectListItem } from "./product.model";

export interface CheckoutDetails {
    CardDetails: CheckOutCardDetails;
    ShippingDetails: CheckOutShippingDetails;
    BillingDetails: CheckOutBillingDetails;
}


export interface CheckOutCardDetails {
    CardHolderName: string;
    CardNumber: string;
    CVC: number;
    ExpiryMonth: number;
    ExpiryYear: number;
    Amount: number;
    ShipmentCharges: number;
    Total: number;
    PromoCode: number;
}

export interface CheckOutShippingDetails {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNo: string;
    ShippingAddress1: string;
    ShippingAddress2: string;
    ShippingCity: string;
    ShippingState: string;
    ShippingCountry: string;
    Zipcode: string;
}

export interface CheckOutBillingDetails {
    BillingAddress1: string;
    City: string;
    State: string;
    Zipcode: string;
}

export interface PaymentModel {
    PaymentId: number;
    CustomerId: number;
    TempId: number;
    CardHolderName: string;
    CVC: string;
    CardNumber: string;
    ExpiryMonth: string;
    ExpiryYear: String;
    Amount: number;
    AmountAfterPromoApplied: number;
    SelectedShippingCharge: number;
    PromocodeName: string;
    PromoPercent: number;
    CycleValue: number;
    CycleType: string;
    TransactionId: string;
    TransactionDate: Date;
    PromocodeId: number;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNo: string;
    ShippingAddress1: string;
    ShippingAddress2: string;
    ShippingCity: string;
    ShippingState: string;
    ShippingZipCode: string;
    ShippingCountry: string;
    DeliveryAddress1: string;
    DeliveryAddress2: string;
    DeliveryCity: string;
    DeliveryState: string;
    DeliveryZipCode: string;
    Products: ProductModel[];
    ShippingCHargeDetails: ShippingAddressType[];
    CountryList: SelectListItem[];
    DeliveryTrackingId: string;
    DeliveryAgencyList: SelectListItem[];
    DeliveryAgencyId: number;
    DeliveryAgencyName: string;
    SubscriptionCheck: boolean;
    IsSchedulePayment?: boolean;
    UerPaymentCount: number;
    FindAboutUs: string;
}

export interface ShippingAddressType {
    Id: number;
    ShippingAddressName: string;
    Price: number;
}



