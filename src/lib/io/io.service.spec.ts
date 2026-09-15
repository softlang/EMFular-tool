import { TestBed } from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it } from 'vitest';

import { IoService } from './io.service';

describe('IoService', () => {

  it('should be created', () => {
    let service = new IoService();
    expect(service).toBeTruthy();
  });
});
