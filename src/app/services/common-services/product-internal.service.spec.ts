import { TestBed } from '@angular/core/testing';

import { ProductInternalService } from './product-internal.service';

describe('ProductInternalService', () => {
  let service: ProductInternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductInternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
