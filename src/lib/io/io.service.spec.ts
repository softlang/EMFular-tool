import {describe, expect, it, vi } from 'vitest';

import { IoService } from './io.service';

describe('IoService', () => {

  it('should be created', () => {
    let service = new IoService();
    expect(service).toBeTruthy();
  });

  it('loads the text from a selected file', async () => {
    const file = new File(['Hello world'], 'test.txt', {
      type: 'text/plain'
    });
    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;
    const service = new IoService();

    await expect(service.loadStringFromFile(event))
        .resolves.toBe('Hello world');
  });

  it('saves a blob as a file', () => {
    const service = new IoService();
    const blob = new Blob(['Hello']);

    const link = document.createElement('a');
    const click = vi.spyOn(link, 'click');

    vi.spyOn(document, 'createElement').mockReturnValue(link);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');

    service.saveFile(blob, 'test.txt');

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(link.href).toBe('blob:test');
    expect(link.download).toBe('test.txt');
    expect(click).toHaveBeenCalledTimes(1);
    expect(document.body.contains(link)).toBe(false);
  });

  it('saves JSON with the .json extension', async () => {
    const service = new IoService();
    const saveFile = vi.spyOn(service, 'saveFile');

    service.saveJson('{"foo":"bar"}', 'model');
    expect(saveFile).toHaveBeenCalledTimes(1);

    const [blob, filename] = saveFile.mock.calls[0];
    expect(filename).toBe('model.json');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/json');
    expect(await blob.text()).toBe('{"foo":"bar"}');
  });

  it('creates a clean SVG blob without ng-version', async () => {
    const service = new IoService();

    const svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );

    svg.setAttribute('ng-version', '19.0.0');

    const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
    );
    rect.setAttribute('width', '100');
    rect.setAttribute('height', '50');

    svg.appendChild(rect);

    const blob = service.cleanCopySVGAsBlob(svg);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/svg+xml');

    const text = await blob.text();

    expect(text).not.toContain('ng-version');
    expect(text).toContain('<rect');
    expect(text).toContain('width="100"');
    expect(text).toContain('height="50"');

    // Original must remain untouched
    expect(svg.hasAttribute('ng-version')).toBe(true);
  });

  it('saves SVG with the .svg extension', () => {
    const service = new IoService();
    const svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );
    const cleanCopy = vi.spyOn(service, 'cleanCopySVGAsBlob');
    const saveFile = vi.spyOn(service, 'saveFile');

    service.saveSVG(svg, 'diagram');
    expect(cleanCopy).toHaveBeenCalledWith(svg);
    expect(saveFile).toHaveBeenCalledTimes(1);
    expect(saveFile.mock.calls[0][1]).toBe('diagram.svg');
  });

  it('starts PNG export', () => {
    const service = new IoService();
    const svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );
    const conversion = vi.spyOn(
        service as any,
        'convertSvgBlobToPngOrJpegAndDownload'
    );

    service.saveSvgAsPng(svg, 'diagram');
    expect(conversion).toHaveBeenCalledWith(
        expect.any(Blob),
        'diagram.png',
        true
    );
  });

  it('starts PNG export', () => {
    const service = new IoService();
    const svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );
    const conversion = vi.spyOn(
        service as any,
        'convertSvgBlobToPngOrJpegAndDownload'
    );

    service.saveSvgAsJpeg(svg, 'diagram');
    expect(conversion).toHaveBeenCalledWith(
        expect.any(Blob),
        'diagram.jpeg',
        false
    );
  });
});
