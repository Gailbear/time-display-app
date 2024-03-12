import { TestBed } from '@angular/core/testing';

import { NowService } from './now.service';

describe('NowService', () => {
  let service: NowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
