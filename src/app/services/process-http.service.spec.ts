import { TestBed } from '@angular/core/testing';

import { ProcessHttpService } from './process-http.service';

describe('ProcessHttpService', () => {
  let service: ProcessHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
