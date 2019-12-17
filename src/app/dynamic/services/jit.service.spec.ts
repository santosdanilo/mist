import { TestBed } from '@angular/core/testing';

import { JitService } from './jit.service';

describe('JitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JitService = TestBed.get(JitService);
    expect(service).toBeTruthy();
  });
});
