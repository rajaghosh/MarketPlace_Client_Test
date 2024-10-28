import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { ServiceInterceptor } from './services/interceptor/service.interceptor';
import { AlertModule } from 'ngx-bootstrap/alert';
import { HeaderComponent } from './components/common/header/header.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { LoaderComponent } from './components/common/loader/loader.component';
import { ServiceUrl } from './services/service-url';
import { ProductService } from './services/http-services/product.service';
import { LoaderService } from './services/common-services/loader.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductCheckOutComponent } from '../app/components/products/product-check-out/product-check-out.component';
import { DatePipe } from '@angular/common';
import { ClickOutsideDirective } from '../app/directives/click-outside-directive';
import { CarouselItemDirective } from '../app/directives/carousal-item-directive';
// import { CommonModule } from '@angular/common';

// import { IvyCarouselModule } from "angular-responsive-carousel";

//#region IMPORT MATERIAL UI MODULES
import { ReactiveFormsModule } from '@angular/forms'; //Must be used for MAT UI FORMS 

//Material UI Modules
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentComponent } from './components/payment/payment.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExplorepageComponent } from './components/explorepage/explorepage.component';
import { AlertDialogComponent } from './components/common/dialog/alert-dialog/alert-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerComponent } from './components/customer/customer.component';
import { DashboardComponent } from './components/customer/dashboard/dashboard.component';
import { UpdateCardDetailsComponent } from './components/customer/dashboard/update-card-details/update-card-details.component';
import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { SubscriptionDialogComponent } from './components/common/subscription-dialog/subscription-dialog.component';
import { ProductAutoshipComponent } from './components/product-autoship/product-autoship.component';
import { AolCarouselComponent } from './components/common/aol-carousel/aol-carousel.component';
import { MultiImageCarousalComponent } from './components/common/multi-image-carousal/multi-image-carousal.component';
// import {MatSnackBarModule} from '@angular/material/snack-bar';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatInputModule } from '@angular/material/input';
//#endregion


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ExplorepageComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    ProductCheckOutComponent,
    PageNotFoundComponent,
    PaymentComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    CustomerComponent,
    DashboardComponent,
    UpdateCardDetailsComponent,
    SubscriptionDialogComponent,
    ClickOutsideDirective,
    CarouselItemDirective,
    ProductAutoshipComponent,
    AolCarouselComponent,
    MultiImageCarousalComponent
    // MatSnackBarModule,
    // MatAutocompleteModule
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AlertModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    // IvyCarouselModule,

    //CommonModule,

    //#region MATERIAL UI MODULES

    ReactiveFormsModule,

    //Material UI Modules

    MaterialModule,
    NgbModule
    //#endregion
  ],
  // exports: [
  //   //#region MATERIAL UI MODULES
  //   CommonModule,
  //   MatTableModule,
  //   MatSortModule,
  //   MatFormFieldModule,
  //   MatInputModule,
  //   MatDatepickerModule,
  //   MatNativeDateModule,
  //   MatIconModule,
  //   MatSelectModule,
  //   MatRadioModule,
  //   MatButtonModule,
  //   //#endregion
  // ],
  providers: [
    ServiceUrl,
    ProductService,
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServiceInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
