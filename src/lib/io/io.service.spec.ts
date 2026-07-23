import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { IoService } from './io.service';

describe('IoService', () => {
  let service: IoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
