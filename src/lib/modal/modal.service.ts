import {Injectable} from "@angular/core";
import {Overlay, OverlayConfig} from "@angular/cdk/overlay";
import {ComponentPortal, ComponentType} from "@angular/cdk/portal";
import {ModalRef} from "./modal-ref";
import {ModalInstance} from "./modal-instance";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    constructor(
        private readonly overlay: Overlay,
    ) {}

    createModal<T, R = void>(
        component: ComponentType<T>,
        config: OverlayConfig
    ): ModalInstance<T, R> {
        const overlayRef = this.overlay.create(config);
        const ref = new ModalRef<R>(overlayRef);
        overlayRef.backdropClick().subscribe(() => {
            ref.close();
        });

        const componentRef = overlayRef.attach(
            new ComponentPortal(component)
        );
        return { ref, componentRef };
    }
}