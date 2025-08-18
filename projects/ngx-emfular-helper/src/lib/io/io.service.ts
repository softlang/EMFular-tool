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

  saveSVG(svgContent: SVGElement, title: string) {
    const contentBlob = new Blob([svgContent.outerHTML], {type: 'image/svg+xml'});
    this.saveFile(contentBlob, title+'.svg');
  }

}
