import { TestBed } from '@angular/core/testing';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef } from '@angular/core';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { AlertService } from './alert.service';
import { AlertComponent } from './alert/alert.component';

describe('AlertService', () => {
  let service: AlertService;
  let overlay: Overlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService]
    });

    service = TestBed.inject(AlertService);
    overlay = TestBed.inject(Overlay);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('opens an alert', () => {
    const overlayRef = {
      attach: vi.fn(() => ({
        instance: {} as AlertComponent
      } as ComponentRef<AlertComponent>)),
      backdropClick: vi.fn(() => ({
        subscribe: vi.fn()
      })),
      dispose: vi.fn()
    };

    vi.spyOn(overlay, 'create').mockReturnValue(
        overlayRef as unknown as OverlayRef
    );

    service.alert('Hello');

    expect(overlay.create).toHaveBeenCalledTimes(1);
    expect(overlayRef.attach).toHaveBeenCalledTimes(1);
  });

  it('creates a separate overlay for each alert', () => {
    const firstRef = createOverlayRef();
    const secondRef = createOverlayRef();

    const createSpy = vi
        .spyOn(overlay, 'create')
        .mockReturnValueOnce(firstRef)
        .mockReturnValueOnce(secondRef);

    service.alert('First');
    service.alert('Second');

    expect(createSpy).toHaveBeenCalledTimes(2);

    expect(firstRef.attach).toHaveBeenCalledTimes(1);
    expect(secondRef.attach).toHaveBeenCalledTimes(1);

    expect(firstRef).not.toBe(secondRef);
  });

  function createOverlayRef(): OverlayRef {
    return {
      attach: vi.fn(() => ({
        instance: {} as AlertComponent
      } as ComponentRef<AlertComponent>)),
      backdropClick: vi.fn(() => ({
        subscribe: vi.fn()
      })),
      dispose: vi.fn()
    } as unknown as OverlayRef;
  }

  it('passes the message to the alert component', () => {
    const componentRef = {
      instance: {} as AlertComponent
    } as ComponentRef<AlertComponent>;

    const overlayRef = {
      attach: vi.fn(() => componentRef),
      backdropClick: vi.fn(() => ({
        subscribe: vi.fn()
      })),
      dispose: vi.fn()
    } as unknown as OverlayRef;

    vi.spyOn(overlay, 'create').mockReturnValue(overlayRef);

    service.alert('Something went wrong');

    expect(componentRef.instance.message).toBe('Something went wrong');
  });
  
});