import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IoService {

  constructor() { }

  async loadStringFromFile(event: Event): Promise<string> {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    return files[0].text();
  }

  saveFile(contentBlob: Blob, fileName: string) {
    const link = document.createElement('a')
    link.style.display = 'none'
    // Attach the content to the anchor
    link.href = URL.createObjectURL(contentBlob);
    link.download = fileName;
    // Append to DOM and simulate click (this will trigger the download)
    document.body.appendChild(link);
    link.click();
    // Cleanup
    document.body.removeChild(link);
  }

  saveJson(json: string, title: string) {
    const contentBlob = new Blob([json], {type: 'application/json'});
    this.saveFile(contentBlob, title+'.json');
  }

  cleanCopySVGAsBlob(svg: SVGElement): Blob {
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    clonedSvg.removeAttribute('ng-version'); // remove Angular artifacts
    const svgText = new XMLSerializer().serializeToString(clonedSvg);
    return new Blob([svgText], { type: 'image/svg+xml' });
  }

  saveSVG(svgContent: SVGElement, title: string) {
    const contentBlob = this.cleanCopySVGAsBlob(svgContent);
    this.saveFile(contentBlob, title+'.svg');
  }

  saveSvgAsPng(svgContent: SVGElement, title: string) {
    const contentBlob = this.cleanCopySVGAsBlob(svgContent);
    this.convertSvgBlobToPngOrJpegAndDownload(contentBlob, title, true);
  }

  saveSvgAsJpeg(svgContent: SVGElement, title: string) {
    const contentBlob = this.cleanCopySVGAsBlob(svgContent);
    this.convertSvgBlobToPngOrJpegAndDownload(contentBlob, title, false);
  }

  private convertSvgBlobToPngOrJpegAndDownload(svgBlob: Blob, title: string, usePng?: boolean): void {
    const reader = new FileReader();

    reader.onload = () => {
      const svgText = reader.result as string;

      const img = new Image();
      const svgBase64 = btoa(
          new TextEncoder()
              .encode(svgText)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      img.src = `data:image/svg+xml;base64,${svgBase64}`;

      img.onload = () => {
        this.loadImgToCanvas(img, title, usePng)
      }

      img.onerror = (err) => {
        console.error('Error loading SVG image:', err);
      };
    };

    reader.onerror = (err) => {
      console.error('Error reading SVG blob:', err);
    };

    reader.readAsText(svgBlob);
  }

  private canvasToPng(canvas: HTMLCanvasElement, fileName: string) {
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) {
        console.error('Failed to convert canvas to PNG blob');
        return;
      } else {
        this.saveFile(pngBlob, fileName+'.png')
      }
    }, 'image/png');
  }

  private canvasToJpeg(canvas: HTMLCanvasElement, fileName: string) {
    canvas.toBlob((jpgBlob) => {
      if (!jpgBlob) {
        console.error('Failed to convert canvas to JPEG blob');
        return;
      } else {
        this.saveFile(jpgBlob, fileName+'.jpeg')
      }
    }, 'image/jpeg', 1);
  }

  private loadImgToCanvas(img: HTMLImageElement, fileName: string, usePng=true) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    ctx.fillStyle = '#ffffff'; // white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    if(usePng) {
      this.canvasToPng(canvas, fileName);
    } else {
      this.canvasToJpeg(canvas, fileName);
    }
  }
}
