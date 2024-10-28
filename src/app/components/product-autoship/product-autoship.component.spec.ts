import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAutoshipComponent } from './product-autoship.component';

describe('ProductAutoshipComponent', () => {
  let component: ProductAutoshipComponent;
  let fixture: ComponentFixture<ProductAutoshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAutoshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAutoshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
