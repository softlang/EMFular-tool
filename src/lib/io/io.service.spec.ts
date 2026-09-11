import { TestBed } from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it } from 'vitest';

import { IoService } from './io.service';

describe('IoService', () => {
  let service: IoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({});
    service = TestBed.inject(IoService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
