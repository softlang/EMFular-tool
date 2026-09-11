# EMFular-Tool

This project supplies model-agnostic Angular utilities for building EMFular editors.
In the EMFular megamodel, Tool is the layer for editor functionality that is not part of the model semantics of `EMFular-Core` and not part of the SVG rendering contracts of `EMFular-Diagram`.
It provides browser-side facilities for history, file input/output, export, input normalization, and alert dialogs.

## Concepts

The EMFular megamodel identifies three Tool concepts: ***Graphical-File Management***, ***JSON-History Management***, and ***JSON-File Management***.
They map to the code as follows.

### Graphical-File Management

Graphical-file management is implemented by the SVG export part of `IoService`.
It receives an `SVGElement`, removes Angular runtime artifacts from a cloned SVG, serializes the SVG, and saves it either as SVG directly or as PNG/JPEG through an intermediate canvas.

Code sections:

- `projects/tool/src/lib/io/io.service.ts`: `cleanCopySVGAsBlob`, `saveSVG`, `saveSvgAsPng`, `saveSvgAsJpeg`
- `projects/tool/src/lib/io/io.service.ts`: private conversion helpers `convertSvgBlobToPngOrJpegAndDownload`, `loadImgToCanvas`, `canvasToPng`, `canvasToJpeg`

```ts
export class IoService {
  cleanCopySVGAsBlob(svg: SVGElement): Blob;
  saveSVG(svgContent: SVGElement, title: string): void;
  saveSvgAsPng(svgContent: SVGElement, title: string): void;
  saveSvgAsJpeg(svgContent: SVGElement, title: string): void;
}
```

### JSON-History Management

JSON-history management is implemented by `HistoryService<T>`.
The service is generic, but in an EMFular editor it is normally instantiated as `HistoryService<JsonOf<M>>`, so each history entry is the JSON representation of a model state.
The states are stored in a circular `localStorage` buffer and exposed through `state$` for undo, redo, and session recovery.

Code sections:

- `projects/tool/src/lib/history/history.service.ts`: circular history buffer, `state$`, `save`, `undo`, `redo`, `clearHistory`

```ts
export class HistoryService<T> {
  state$: Observable<T | null>;

  constructor(prefix?: string, bufferSize?: number, platformId?: Object);

  clearHistory(): void;
  save(elem: T): void;
  undo(): T | null;
  redo(): T | null;
  isUndoNotPossible(): boolean;
  isRedoNotPossible(): boolean;
}
```

### JSON-File Management

JSON-file management is split between Tool and Integration.
Tool provides the browser file primitives in `IoService`: reading a selected file as text and saving a JSON string as a `.json` download.

Code sections:

- `projects/tool/src/lib/io/io.service.ts`: `loadStringFromFile`, `saveJson`, `saveFile`

```ts
export class IoService {
  loadStringFromFile(event: Event): Promise<string>;
  saveFile(contentBlob: Blob, fileName: string): void;
  saveJson(json: string, title: string): void;
}
```

### Additional Tool Helpers

The package also exports small helper APIs that are not separate Tool concepts in the megamodel:

- `InputHandler` normalizes browser input events, especially numeric input and repeated file selections.
- `AlertService` and `AlertComponent` provide a minimal Angular Material message dialog.

## Support

Support is currently offered by the main developer, Susanne Göbel under goebel@uni-koblenz.de.

## Contributing

We are open to contributors. Maybe you would like to write your bachelor's or master's thesis on EMFular? Read our [arXiv-paper](https://arxiv.org/abs/2606.11442) and get in touch with Susanne Göbel goebel@uni-koblenz.de.

## License

EMFular-diagram is subject to (C) 2026, SoftLang Research Team, University of Koblenz, Faculty of CS, contact Susanne Göbel or Ralf Lämmel.
It is provided under the ***CC BY 4.0 license***.
Basically, you are free to share and adapt the material as long as you give proper credit to us and our project.
Feel free to include EMFular into your research but please cite us.
