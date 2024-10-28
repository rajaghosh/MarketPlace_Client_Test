import { TestBed } from '@angular/core/testing';

import { ProductInternalOperationService } from './product-internal-operation.service';

describe('ProductInternalOperationService', () => {
  let service: ProductInternalOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductInternalOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
