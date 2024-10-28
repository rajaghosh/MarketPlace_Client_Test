import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCheckOutComponent } from './product-check-out.component';

describe('ProductCheckOutComponent', () => {
  let component: ProductCheckOutComponent;
  let fixture: ComponentFixture<ProductCheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCheckOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
