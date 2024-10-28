import { Injectable } from '@angular/core';
import { ProductCategory } from '../../../app/models/product.model';
import { HomepageTopCarousal, LinkForUi } from '../../models/homepage.model';
import { ProductService } from '../http-services/product.service';
import { environment } from  '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeInternalService {



  public uriProductLocationCloud = environment.apiUrlImageProducts;//'https://marketplaceadmin.drstellamd.com/UploadFiles/ProductImages/';
  public uriProductLocationLocal = '../../../assets/images/';

  public objUiLinksList: LinkForUi[] = [];


  public homePageTopCarousalLocList: string[] = [
    'Physician_formulated.jpg',
    'Covilyte.jpg'
  ];

  public homePageTopCasousalList: HomepageTopCarousal[] = [
    { Path: 'MemorialDay.png', Url: '/productlist?category=All', Label: '', Id: 'TopCarousalLink1' },
    { Path: 'Physician_formulated.jpg', Url: '/productlist?category=All', Label: '', Id: 'TopCarousalLink1' },
    { Path: 'Covilyte.jpg', Url: '/productlist?product=6', Label: '', Id: 'TopCarousalLink2' },
    { Path: 'Spring15.png', Url: '/productlist?category=All', Label: '', Id: 'TopCarousalLink1' },
    // { Path: 'StorableFood.jpg', Url: '/productlist?category=All', Label: '', Id: 'TopCarousalLink1' },
  ];

  public uriPageListingEnum: ProductCategory[] = [
    { Id: 0, Name: 'All' },
    { Id: 1, Name: 'Supplements' },
    { Id: 2, Name: 'T-Shirt' },
    { Id: 3, Name: 'Bundles&Kits' },
    { Id: 4, Name: 'MedicalDevices' },
    { Id: 5, Name: 'Autoship' },
    { Id: 6, Name: 'LetAmericaLive' },
    { Id: 7, Name: 'MedicinalHerb' },
    { Id: 8, Name: 'SkinAndHairCare' },
    { Id: 9, Name: 'GummyVitamins' },
  ]

  public uriExplorePageListingEnum: ProductCategory[] = [
    { Id: 0, Name: 'Affliate' },
    { Id: 1, Name: 'Referral' },
    { Id: 2, Name: 'Faq' },
    { Id: 3, Name: 'Test' },
  ]


  constructor() {
  }


}
