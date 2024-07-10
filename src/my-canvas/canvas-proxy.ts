import { isBrowser } from "../utils";
import * as nodeCanvas from "canvas";

export default nodeCanvas;

export const CanvasContext2D = isBrowser
    ? window.CanvasRenderingContext2D
    : nodeCanvas.CanvasRenderingContext2D;

export type CanvasContext2DType = nodeCanvas.CanvasRenderingContext2D | CanvasRenderingContext2D;

// 先为CanvasRenderingContext2D扩展一些方法
;(function (CanvasRenderingContext2D) {
    if (!CanvasRenderingContext2D.prototype.flexibleText) {
        // 添加文字创建的方法
        CanvasRenderingContext2D.prototype.flexibleText = function (
            text: string,
            x: number,
            y: number,
            maxWidth?: number,
            lineHeight?: number,
            letterSpacing?: number
        ) {
            const context = this;
            const canvas = context.canvas;
            maxWidth = (maxWidth || (canvas && canvas.width) || 300 ) as number;

            lineHeight = lineHeight || 30;
            letterSpacing = letterSpacing || 0;
            const hasLetterSpacing = letterSpacing > 0;

            const _getMetricsWidth = (testText: string, extraWidth = 0) => {
                if (!testText) return 0;
                const metrics = context.measureText(testText);
                return Math.ceil(metrics.width) + extraWidth;
            };

            // 当前行
            let currentLineCharList: string[] = [];
            // 当前字符起始x轴坐标
            let currentCharX = x;

            for (let char of text) {
                let metricsWidth = 0;
                const currentLine = currentLineCharList.join("");
                const lineLength = currentLineCharList.length;
                const letterSpacingTotal = letterSpacing * Math.max(lineLength - 1, 0);
                metricsWidth = _getMetricsWidth(currentLine + char, letterSpacingTotal);

                // 超行的情况处理
                if (metricsWidth > maxWidth && lineLength > 0) {
                    if (!hasLetterSpacing) {
                        // 绘制当前行
                        context.fillText(currentLine, x, y);
                    }
                    currentLineCharList = [char];
                    currentCharX = x;
                    y += lineHeight;
                } else {
                    currentLineCharList.push(char);
                }

                if (hasLetterSpacing) {
                    // 绘制当前字符
                    context.fillText(char, currentCharX, y);
                    // 为下一个字符设定x轴坐标
                    currentCharX = currentCharX + _getMetricsWidth(char, letterSpacing);
                }
            }

            // 整行渲染时，最后一行的绘制
            if (!hasLetterSpacing && currentLineCharList.length > 0) {
                context.fillText(currentLineCharList.join(""), x, y);
            }
        };
    }


    if (!CanvasRenderingContext2D.prototype.wrapText) {
        // 可换行文字绘制
        CanvasRenderingContext2D.prototype.wrapText = function (
            text: string,
            x: number,
            y: number,
            maxWidth?: number,
            lineHeight?: number
        ) {
            this.flexibleText(text, x, y, maxWidth, lineHeight);
        };
    }

    if (!CanvasRenderingContext2D.prototype.looseText) {
        // 带字间距的文字绘制
        CanvasRenderingContext2D.prototype.looseText = function (
            text: string,
            x: number,
            y: number,
            letterSpacing?: number
        ) {
            this.flexibleText(text, x, y, undefined, undefined, letterSpacing);
        };
    }
})(CanvasContext2D);