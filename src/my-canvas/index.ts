import { isBrowser } from "../utils";
import nodeCanvas, { CanvasContext2D, CanvasContext2DType } from "./canvas-proxy"
import { CanvasEntity, ImageEntity } from "./canvas-extension";

export {
    CanvasContext2D
}

export type {
    CanvasContext2DType,
    CanvasEntity,
    ImageEntity,
}

export const loadImage = (url: string, options?: any): Promise<ImageEntity> => {
    if (isBrowser) {
        return new Promise((resolve, reject) => {
            const image = new window.Image();
            image.src = url;
            image.onload = () => resolve(image);

            image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        });
    }

    return nodeCanvas.loadImage(url, options);
};

export const createCanvas = (width: number, height: number, type?: 'pdf'|'svg'): CanvasEntity => {
    if (isBrowser) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    return nodeCanvas.createCanvas(width, height, type);
};