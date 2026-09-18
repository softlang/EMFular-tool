import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AlertComponent } from './alert.component';
import { OverlayRef } from '@angular/cdk/overlay';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let overlayRef: OverlayRef;

  beforeEach(async () => {
    overlayRef = {
      dispose: vi.fn()
    } as unknown as OverlayRef;

    await TestBed.configureTestingModule({
      imports: [AlertComponent],
      providers: [
        { provide: OverlayRef, useValue: overlayRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closes the overlay', () => {
    component.closeMe();
    expect(overlayRef.dispose).toHaveBeenCalled();
  });
});