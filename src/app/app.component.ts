import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MarketPlace-Client';
  isCustomerUI: boolean = false;
  constructor(private router: Router) {
    console.log(this.router.url);
    
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((x: any) => {
      if(x.urlAfterRedirects.indexOf('/customer') > -1) {
        this.isCustomerUI = !this.isCustomerUI;
      }
    });
   
  }

  ngOnInit(): void {
    

  }
}


