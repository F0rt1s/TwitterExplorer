import { TestBed, inject } from '@angular/core/testing';

import { DataproviderService } from './dataprovider.service';

describe('DataproviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataproviderService]
    });
  });

  it('should be created', inject([DataproviderService], (service: DataproviderService) => {
    expect(service).toBeTruthy();
  }));
});
