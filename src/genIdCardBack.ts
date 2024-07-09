import { getCanvas, loadBackground, getAddrByIdNo } from "./idCard";
import { parseIdCard, formatDate, toDate } from "./utils";
import {CanvasContext2DType, CanvasEntity} from "./my-canvas";
import { tools as randomCodingTools } from "@zuoque/random-coding"
import bgImgUrl from "./assets/id-card-guohui.png";
const { getAge } = randomCodingTools;

/**
 * 生成身份证国徽面配置项
 */
export interface IdCardBackOptions {
  /** 画布元素或画布元素的选择器 **/
  canvas?: HTMLCanvasElement | string,
  /** 身份证号 **/
  idNo?: string,
  /** 身份证有效期的起始日期 **/
  startDate?: Date | string,
  /** 身份证有效期的结束日期 **/
  endDate?: Date | string,
  /** 公安局名称 **/
  policeName?: string,
  /** 背景图 **/
  bgUrl?: string,
}

export type IdCardBackInfo = {
  canvas: CanvasEntity,
  dataUrl: string,
  startDate: string,
  endDate: string
}


/**
 * 生成身份证的国徽面
 * @param {IdCardBackOptions} options
 */
export const genIdCardBack = async (options?: IdCardBackOptions): Promise<IdCardBackInfo> => {
  let {
    canvas: outCanvas,
    idNo,
    startDate,
    endDate,
    policeName,
    bgUrl = bgImgUrl,
  } = options || {};

  const canvas = getCanvas(outCanvas);
  // 考虑没有画布创建的情况
  if (!canvas) {
    throw new Error("无法创建画布，请检查是否传递了正确的canvas字段");
  }

  const ctx = canvas.getContext("2d") as CanvasContext2DType;

  if (!ctx) {
    throw new Error("无法创建画布上下文");
  }

  // 创建一个新Image对象，加载身份证底纹图
  await loadBackground(canvas, bgUrl);

  startDate = getStartDate(startDate, idNo);
  endDate = getEndDate(startDate, endDate, idNo);
  const startDateStr = formatDate(startDate, "yyyy.MM.dd");
  const endDateStr = endDate === "长期" ? endDate : formatDate(endDate, "yyyy.MM.dd");

  // 获取地域公安局
  const police = getAddrByIdNo(idNo || '').policeAddr || '上海市';
  // 添加姓名和人像元素
  ctx.font = "bold 20px SimHei"; // 设置字体大小和样式
  ctx.fillStyle = "#000"; // 设置字体颜色
  ctx.fillText("签发机关", 140, 310);
  ctx.fillText("有效期限", 140, 360);
  ctx.font = "22px SimSun"; // 设置字体大小和样式
  ctx.fillText(policeName || police, 260, 310);
  ctx.fillText(`${startDateStr} - ${endDateStr}`, 260, 360);

  return {
    canvas,
    dataUrl: canvas.toDataURL(),
    startDate: startDateStr,
    endDate: endDateStr,
  };
};


/**
 * 身份证的有效期限起始日期并返回日期对象，指定了起始日则直接转换为日期对象
 * 如果没有指定起始日，则根据身份证信息，如果在5年内，则起始日期为身份证出生日期，否则起始日期为5年前
 * @param startDate 指定起始日
 * @param idNo 身份证信息
 */
type DateOrString = string | Date;
const getStartDate = (startDate?: DateOrString, idNo?: string): Date => {
  const now = new Date();
  const idNoInfo = parseIdCard(idNo);
  if (!startDate) {
    let year = now.getFullYear() - 5;
    if (idNoInfo?.year && year < idNoInfo.year) {
      year = idNoInfo.year;
    }
    const month = idNoInfo?.month || 1;
    const day = idNoInfo?.day || 1;
    startDate = new Date(year, month - 1, day);
  }
  return toDate(startDate) || getStartDate(undefined, idNo);
}


/**
 * 身份证的有效期限结束日期并返回日期对象，指定了结束日则直接转换为日期对象
 * 如果提供身份证号，判断大于46岁的默认是长期有效，或者指定了起始时间，大于了30年，也为长期
 * @param startDate
 * @param endDate
 * @param idNo
 */
type EndDateType = Date | "长期";
const getEndDate = (startDate?: DateOrString, endDate?: DateOrString, idNo?: string): EndDateType => {
  const now = new Date();
  const idNoInfo = parseIdCard(idNo);
  startDate = toDate(startDate || '') || getStartDate(startDate, idNo);
  if (!endDate) {
    const diff = now.getFullYear() - startDate.getFullYear();
    if (diff > 30) {
      endDate = "长期";
    } else {
      const year = startDate.getFullYear() + Math.min(Math.max(diff, 20), 30);
      const month = startDate.getMonth();
      const day = startDate.getDate();
      endDate = new Date(year, month, day);
    }
  }

  if (idNoInfo?.year && idNo && getAge(idNo) > 46) {
    // 大于46岁的默认是长期有效
    return "长期";
  }

  return toDate(endDate) || getEndDate(startDate, undefined, idNo);
}