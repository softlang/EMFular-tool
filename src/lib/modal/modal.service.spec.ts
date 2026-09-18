import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {OverlayContainer} from '@angular/cdk/overlay';
import {describe, expect, it, beforeEach, afterEach} from 'vitest';
import {ModalService} from './modal.service';

@Component({
    template: '<div class="test-modal">Test modal</div>'
})
class TestModalComponent {}

describe('ModalService', () => {

    let service: ModalService;
    let overlayContainer: OverlayContainer;
    let overlayElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ModalService]
        });

        service = TestBed.inject(ModalService);
        overlayContainer = TestBed.inject(OverlayContainer);
        overlayElement = overlayContainer.getContainerElement();
    });

    afterEach(() => {
        overlayContainer.ngOnDestroy();
        TestBed.resetTestingModule();
    });

    it('attaches the given component and returns its component ref', () => {
        const instance = service.createModal(TestModalComponent, {});
        expect(instance.componentRef.instance)
            .toBeInstanceOf(TestModalComponent);
        expect(
            overlayElement.querySelector('.test-modal')
        ).not.toBeNull();
        instance.ref.close();
    });

    it('emits a result when the modal is closed with a result', () => {
        const instance = service.createModal<
            TestModalComponent,
            string
        >(TestModalComponent, {});

        let result: string | undefined;
        instance.ref.closed.subscribe(value => {
            result = value;
        });
        instance.ref.close('hello');
        expect(result).toBe('hello');
    });

    it('emits undefined when the modal is closed without a result', () => {
        const instance = service.createModal<
            TestModalComponent,
            string
        >(TestModalComponent, {});

        let result: string | undefined = 'not-closed';
        instance.ref.closed.subscribe(value => {
            result = value;
        });
        instance.ref.close();
        expect(result).toBeUndefined();
    });

    it('closes without a result when the backdrop is clicked', () => {
        const instance = service.createModal<
            TestModalComponent,
            string
        >(TestModalComponent, {
            hasBackdrop: true
        });

        let result: string | undefined = 'not-closed';
        instance.ref.closed.subscribe(value => {
            result = value;
        });
        const backdrop = overlayElement.querySelector(
            '.cdk-overlay-backdrop'
        ) as HTMLElement;

        expect(backdrop).not.toBeNull();
        backdrop.click();
        expect(result).toBeUndefined();
    });

});