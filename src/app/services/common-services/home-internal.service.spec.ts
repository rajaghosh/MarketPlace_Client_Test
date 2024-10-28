import { TestBed } from '@angular/core/testing';

import { HomeInternalService } from './home-internal.service';

describe('HomeInternalService', () => {
  let service: HomeInternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeInternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
