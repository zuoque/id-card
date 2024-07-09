import { createCanvas, loadImage, CanvasEntity, ImageEntity } from "./my-canvas";
import { isBrowser } from "./utils";
import { areaUtils, tools } from "@zuoque/random-coding";

export { loadImage };

// 按身份证的宽高比
export const canvasWidth = 640;
export const canvasHeight = Math.round(canvasWidth / 1.5859);

// 创建canvas
type CanvasSelector = Nullable<HTMLCanvasElement | string>;

/**
 * 获取canvas对象，并设置宽高
 */
export function getCanvas(params?: any): Nullable<CanvasEntity>;
/**
 * 通过css选择器获取canvas对象，并设置宽高
 */
export function getCanvas(selector: string): Nullable<CanvasEntity>;
/**
 * 为指定的canvas设定宽度并返回
 */
export function getCanvas(canvasEl: HTMLCanvasElement): Nullable<CanvasEntity>;
/**
 * 获取canvas对象，并设置宽高
 * @param canvasElOrSelector canvas元素或选择器, 参数主要在浏览器环境下有效
 */
export function getCanvas(canvasElOrSelector?: CanvasSelector): Nullable<CanvasEntity> {
  let canvas: Nullable<CanvasEntity>;
  if (isBrowser) {
    if (typeof canvasElOrSelector === "string") {
      canvas = document.querySelector(canvasElOrSelector) as HTMLCanvasElement;
    } else if (canvasElOrSelector && canvasElOrSelector instanceof HTMLCanvasElement) {
      canvas = canvasElOrSelector;
    } else {
      canvas = document.createElement("canvas");
    }

    // 如果canvas存在，或是不是
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      return null;
    }
  } else {
    canvas = createCanvas(canvasWidth, canvasHeight);
  }



  if (canvas) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }
  return canvas;
}

/**
 * 加载身份证底纹图
 * @param canvas 画布
 * @param url 身份证底纹图url
 */
export const loadBackground = async (canvas: CanvasEntity, url: string): Promise<ImageEntity> => {
  if (!canvas || !url)
    return Promise.reject(new Error(`loadBackground方法参数缺失`));

  let ctx = canvas.getContext("2d");

  if (!ctx) return Promise.reject(new Error(`无法获取canvas的上下文`));

  // 创建一个新Image对象，加载身份证底纹图
  const image = await loadImage(url);

  // 将底纹图绘制到canvas上
  // @ts-ignore TODO
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return image;
};

/**
 * 根据身份证获取和地址相关的信息
 * @param idNo
 */
export const getAddrByIdNo = (idNo: string) => {
  const addrList = areaUtils.findAreaNamesByCode(idNo, true);
  const county = addrList[2];
  const isXian = county.includes("县");
  const city = !isXian && addrList[1] || "";
  return {
    addrList,
    address: tools.removeDuplicateWords(addrList.join("")),
    policeAddr: isXian || county.length >= 6 ? `${county}公安局` : `${city}${county}公安局`
  }
}