import {Injectable} from "@angular/core";
import {Overlay, OverlayConfig, PositionStrategy} from "@angular/cdk/overlay";
import {ComponentPortal, ComponentType} from "@angular/cdk/portal";
import {ModalRef} from "./modal-ref";
import {ModalInstance} from "./modal-instance";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private defaultStrategyCentered: PositionStrategy;

    constructor(
        private readonly overlay: Overlay,
    ) {
        this.defaultStrategyCentered = this.overlay.position().global()
            .centerHorizontally()
            .centerVertically()
    }

    createModal<T, R = void>(
        component: ComponentType<T>,
        config: OverlayConfig
    ): ModalInstance<T, R> {
        const overlayConfig: OverlayConfig = {
            ...config,
            positionStrategy: config.positionStrategy ?? this.defaultStrategyCentered
        };
        const overlayRef = this.overlay.create(overlayConfig);
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