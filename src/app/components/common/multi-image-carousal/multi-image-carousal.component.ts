import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { ProductInternalService } from 'src/app/services/common-services/product-internal.service';
import { ProductService } from 'src/app/services/http-services/product.service';

@Component({
  selector: 'app-multi-image-carousal',
  templateUrl: './multi-image-carousal.component.html',
  styleUrls: ['./multi-image-carousal.component.css']
})
export class MultiImageCarousalComponent implements OnInit {

  resultDataList: ProductModel[] = [];
  carousalWidth: number = 844;

  constructor(private productService: ProductService,
    public productInternal: ProductInternalService) {

    this.LoadAllProducts();
  }

  ngOnInit(): void {
  }

  LoadAllProducts() {



    try {

      this.productService.getProductsAsync(0).subscribe(s => {
        let result = s;
        this.resultDataList = result.Data;

        // this.carousalWidth = result.Data.length * 211;
        this.carousalWidth = 211 * result.Data.length;
      });


      // this.productService.getFeatureProductsAsync().subscribe(s => {
      //   let result = s;
      //   this.resultDataList = result.Data;
      // });
    }
    catch (e) {
    }

  }


}
