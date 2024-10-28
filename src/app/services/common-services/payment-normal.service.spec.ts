import { TestBed } from '@angular/core/testing';

import { PaymentNormalService } from './payment-normal.service';

describe('PaymentNormalService', () => {
  let service: PaymentNormalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentNormalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
