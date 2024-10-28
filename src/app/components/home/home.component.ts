import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeInternalService } from '../../services/common-services/home-internal.service';
import { ProductModel, ProductCartModel, ProductSubscriptionModel, CountryModel, ProductImageSlider } from '../../../app/models/product.model';
import { NgbCarousel, NgbCarouselModule, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ProductInternalService } from '../../services/common-services/product-internal.service';
import { NavigationEnd, Router } from '@angular/router';
import { HomepageTopCarousal, LinkForUi } from '../../models/homepage.model';
import { ProductService } from '../../services/http-services/product.service';
import { SubscriptionDialogComponent } from '../common/subscription-dialog/subscription-dialog.component';
import { ProductInternalOperationService } from '../../services/common-services/product-internal-operation.service';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';  //'../../environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {

  //topImagesCarousal: ProductImageSlider[] = [];
  topImagesCarousal: HomepageTopCarousal[] = [];

  urlMidProduct1: string = "";
  urlMidProduct2: string = "";
  urlMidProduct3: string = "";
  urlFeatureProduct1: string = "";
  urlFeatureProduct2: string = "";
  urlFeatureProduct3: string = "";
  urlFeatureProduct4: string = "";
  urlShopMedicalDevice: string = "";
  urlLetAmericaLive: string = "";
  urlTopCarousalLink1: string = "";
  urlTopCarousalLink2: string = "";
  urlBottomTopLink1: string = "";
  urlPrepareTodayLink1: string = "";

  isEmptyPageLoaded: number = 0;
  resultDataList: ProductModel[] = [];

  subsciptionEmail: string = "";

  imageLink: string = environment.apiUrlImage;

  images: any = [
    "http://placehold.it/500/e499e4/fff&amp;text=1",
    "http://placehold.it/500/e499e4/fff&amp;text=2",
    "http://placehold.it/500/e499e4/fff&amp;text=3",
    "http://placehold.it/500/e499e4/fff&amp;text=4",
    "http://placehold.it/500/e499e4/fff&amp;text=5",
    "http://placehold.it/500/e499e4/fff&amp;text=6",
    "http://placehold.it/500/e499e4/fff&amp;text=7",
    "http://placehold.it/500/e499e4/fff&amp;text=8",
    "http://placehold.it/500/e499e4/fff&amp;text=9",
  ];

  //This click event subcription will receive event message / trigger when "check out" clicked at the header component
  clickEventsubscription_CallProductCheckOutAddressDetails: Subscription;

  linksForUiList: LinkForUi[] = [];

  constructor(public homeInternal: HomeInternalService,
    config: NgbCarouselConfig,
    public productInternal: ProductInternalService,
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog,
    private productInternalOperation: ProductInternalOperationService,
    private overlay: Overlay,
    private _snackBar: MatSnackBar
  ) {


    //debugger;
    //This will restrict only Cart Check-Out Navigation to Payment CheckOut Page
    this.productInternal.varPaymentPageNavProtectVal = 0;

    //This step is important to instantiate the Go To Cart Page event
    this.clickEventsubscription_CallProductCheckOutAddressDetails =
      this.productInternal
        .getClickEvent_CallProductCheckOutAddressDetails()
        .subscribe(() => {
          this.OpenChildForProductCheckOut();
        });

    config.interval = 3000;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.animation = true;



  }

  ngOnInit(): void {
    //This will restrict only Cart Check-Out Navigation to Payment CheckOut Page
    //this.productInternal.varPaymentPageNavProtectVal = 0;

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });


    this.LoadUILinks();
    this.FeatureProductServiceCall();

  }





  OpenChildForProductCheckOut() {
    if (!this.productInternal.varIsPaymentPageShowUsingChildComponent) {
      this.router.navigate(['payment/checkout']);
    }
  }

  LoadUILinks() {
    try {

      // debugger;
      this.productService.getUiLinksAsync().subscribe(s => {

        // debugger;

        let result = s;
        this.linksForUiList = result.Data;

        this.urlMidProduct1 = this.linksForUiList.filter(p => p.LinkName == 'MidProduct1').map(p => p.LinkUrl)[0] ?? "";
        this.urlMidProduct2 = this.linksForUiList.filter(p => p.LinkName == 'MidProduct2').map(p => p.LinkUrl)[0] ?? "";
        this.urlMidProduct3 = this.linksForUiList.filter(p => p.LinkName == 'MidProduct3').map(p => p.LinkUrl)[0] ?? "";
        this.urlFeatureProduct1 = this.linksForUiList.filter(p => p.LinkName == 'FeatureProduct1').map(p => p.LinkUrl)[0] ?? "";
        this.urlFeatureProduct2 = this.linksForUiList.filter(p => p.LinkName == 'FeatureProduct2').map(p => p.LinkUrl)[0] ?? "";
        this.urlFeatureProduct3 = this.linksForUiList.filter(p => p.LinkName == 'FeatureProduct3').map(p => p.LinkUrl)[0] ?? "";
        this.urlFeatureProduct4 = this.linksForUiList.filter(p => p.LinkName == 'FeatureProduct4').map(p => p.LinkUrl)[0] ?? "";
        this.urlShopMedicalDevice = this.linksForUiList.filter(p => p.LinkName == 'ShopMedicalDevice').map(p => p.LinkUrl)[0] ?? "";
        this.urlLetAmericaLive = this.linksForUiList.filter(p => p.LinkName == 'LetAmericaLive').map(p => p.LinkUrl)[0] ?? "";
        this.urlTopCarousalLink1 = this.linksForUiList.filter(p => p.LinkName == 'TopCarousalLink1').map(p => p.LinkUrl)[0] ?? "";
        this.urlTopCarousalLink2 = this.linksForUiList.filter(p => p.LinkName == 'TopCarousalLink2').map(p => p.LinkUrl)[0] ?? "";
        this.urlBottomTopLink1 = this.linksForUiList.filter(p => p.LinkName == 'BottomTop1').map(p => p.LinkUrl)[0] ?? "";
        this.urlPrepareTodayLink1 = this.linksForUiList.filter(p => p.LinkName == 'PrepareToday1').map(p => p.LinkUrl)[0] ?? "";


      });


      this.productService.getUiTopRowBannerAsync().subscribe(s => {

        // debugger;
        let result = s;
        result.Data.forEach((imgData: { ImageLocation: string; Link: string; ImageName: string; }) => {

          let topCarousal: HomepageTopCarousal = {} as HomepageTopCarousal;
          topCarousal.Path = this.imageLink + imgData.ImageLocation;
          topCarousal.Url = imgData.Link;
          topCarousal.Label = imgData.ImageName;

          this.topImagesCarousal.push(topCarousal);
        });

      });
    }
    catch (e) {

    }
  }

  //#region ProductServiceDataFetchCall
  FeatureProductServiceCall() {
    try {

      this.productService.getFeatureProductsAsync().subscribe(s => {
        let result = s;
        this.resultDataList = result.Data;
      });
    }
    catch (e) {
    }

  }
  //#endregion

  OpenSubscriptionDialog(product: ProductModel, selectedSubscription: ProductSubscriptionModel | undefined = undefined) {

    //debugger;

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

  }

  ValidateSubscriptionEmail() {

  }

  SubscriptionAccept() {
    //debugger;
    console.log(this.subsciptionEmail);
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(this.subsciptionEmail); // true
    if (!result) {

      this.openSnackBar("Please enter a valid email.", "Dismiss");
    }
    else {
      this.openSnackBar("Your subscription is successful.", "Dismiss");
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  closeSnackBar() {
    this._snackBar.dismiss();
  }

  items = [
    { title: 'Slide 1' },
    { title: 'Slide 2' },
    { title: 'Slide 3' },
  ]

  //IMAGES array implementing Image interface
  imagesList = [
    { "title": "We are covered", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/covered.jpg" },
    { "title": "Generation Gap", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/generation.jpg" },
    { "title": "Potter Me", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/potter.jpg" },
    { "title": "Pre-School Kids", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/preschool.jpg" },
    { "title": "Young Peter Cech", "url": "https://raw.githubusercontent.com/christiannwamba/angular2-carousel-component/master/images/soccer.jpg" }
  ];


  addSlide() {
    this.items.push({
      title: `Slide 4`
    });
  }


  images22 = [

    { path: "http://placehold.it/500/e499e4/fff&amp;text=1" },
    { path: "http://placehold.it/500/e499e4/fff&amp;text=2" },
    { path: "http://placehold.it/500/e499e4/fff&amp;text=3" },
    { path: "http://placehold.it/500/e499e4/fff&amp;text=4" },
  ];



}
