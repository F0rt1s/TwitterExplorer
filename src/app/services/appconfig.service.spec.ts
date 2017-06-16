import { TestBed, inject } from '@angular/core/testing';

import { AppconfigService } from './appconfig.service';

describe('AppconfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppconfigService]
    });
  });

  it('should ...', inject([AppconfigService], (service: AppconfigService) => {
    expect(service).toBeTruthy();
  }));
});
