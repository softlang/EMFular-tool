import {Injectable, Injector} from "@angular/core";
import {Overlay, OverlayConfig, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal, ComponentType} from "@angular/cdk/portal";
import {ModalRef} from "./modal-ref";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(
        private readonly overlay: Overlay,
        private readonly injector: Injector
    ) {}

    createClosableModal<T>(component: ComponentType<T>, config: OverlayConfig): ModalRef<T> {
        const overlayRef = this.overlay.create(config)
        const injector = Injector.create({
            providers: [
                {
                    provide: OverlayRef,
                    useValue: overlayRef
                }
            ],
            parent: this.injector
        });
        const componentRef = overlayRef.attach<T>(
            new ComponentPortal(component, null, injector))
        overlayRef.backdropClick().subscribe(() => {
            overlayRef.dispose();
        });
        return {
            componentRef: componentRef,
            close: () => overlayRef.dispose(),
            closed: overlayRef.detachments()
        };
    }

}