import { TestBed } from '@angular/core/testing';

import { WledApiService } from './wled-api-service.service';

describe('WledApiServiceService', () => {
  let service: WledApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WledApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
