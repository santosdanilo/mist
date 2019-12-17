import { TestBed } from '@angular/core/testing';

import { JITProjectionService } from './jit.service';

describe('JitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JITProjectionService = TestBed.get(JITProjectionService);
    expect(service).toBeTruthy();
  });
});
