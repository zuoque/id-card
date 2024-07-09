import {Canvas, CanvasRenderingContext2D, Image} from "canvas";

export type ImageEntity = Image | HTMLImageElement;

export type CanvasEntity = HTMLCanvasElement | Canvas;

/**
 * 扩展CanvasRenderingContext2D的功能
 */
interface CustomCanvasRenderingContext2D {
    // 文字的弹性渲染，支持换行
    flexibleText(
        text: string,
        x: number,
        y: number,
        maxWidth?: number,
        lineHeight?: number,
        letterSpacing?: number
    ): void;

    // 支持换行
    wrapText(
        text: string,
        x: number,
        y: number,
        maxWidth?: number,
        lineHeight?: number,
        letterSpacing?: number
    ): void;

    // 字间距控制
    looseText(
        text: string,
        x: number,
        y: number,
        letterSpacing?: number
    ): void;

    // 画图（主要防止类型检查错误）
    // drawImage(image: ImageEntity, dx: number, dy: number, dw: number, dh: number): void;
}

declare module "canvas" {
    interface CanvasRenderingContext2D extends CustomCanvasRenderingContext2D {}
}

declare global {
    interface CanvasRenderingContext2D extends CustomCanvasRenderingContext2D {}
    /*interface HTMLCanvasElement {
        getContext(contextId: '2d'): CanvasRenderingContext2D;
    }*/
}