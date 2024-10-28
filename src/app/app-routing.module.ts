import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { HomeComponent } from './components/home/home.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ExplorepageComponent } from './components/explorepage/explorepage.component';
import { CustomerComponent } from './components/customer/customer.component';
import { DashboardComponent } from './components/customer/dashboard/dashboard.component';
import { ProductAutoshipComponent } from './components/product-autoship/product-autoship.component';
import { MultiImageCarousalComponent } from './components/common/multi-image-carousal/multi-image-carousal.component';

const routes: Routes = [
  { path: 'index', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'productlist', component: ProductsComponent },
  { path: 'payment/checkout', component: PaymentComponent },
  { path: 'explore', component: ExplorepageComponent },
  { path: 'autoship-order', component: ProductAutoshipComponent },
  { path: 'test1', component: MultiImageCarousalComponent },
  { path: 'payment/address', component: PaymentComponent },
  { path: 'payment/supplementproduct', component: PaymentComponent },
  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reditect', redirectTo: '/' }
    ]
  },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top', // Add options right here
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
