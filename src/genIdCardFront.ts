import { getCanvas, loadImage, loadBackground, getAddrByIdNo } from "./idCard";
import { IdCardInfo, parseIdCard } from "./utils";
import { idNoUtils } from "@zuoque/random-coding";
import { mock } from "mockjs";
import { CanvasContext2DType, CanvasEntity, ImageEntity } from "./my-canvas";
import bgImgUrl from "./assets/id-card-renxiang.png";
import manAvatarUrl from "./assets/man.png";
import womanAvatarUrl from "./assets/woman.png";

const buildAddrByIdNo = (idNo?: string): string => {
  let county = "";
  if (idNo) {
    county = getAddrByIdNo(idNo).address || ""
  }

  if (county) {
    return mock(`${county}@cword(2, 3)街道@cword(2, 3)路@natural(10, 1000)弄@natural(1, 10)号@natural(10, 1808)室`);
  }

  return "上海市浦东新区塘桥街道蓝村路471弄10号1801室";
};

/**
 * 生成身份证配置项
 */
export interface IdCardOptions {
  /** 画布元素或画布元素的选择器 **/
  canvas?: HTMLCanvasElement | string;
  /** 姓名 **/
  name?: string;
  /** 身份证号 **/
  idNo?: string;
  /** 民族 **/
  nationality?: string;
  /** 居住地 **/
  address?: string;
  /** 正面背景图地址url **/
  bgUrl?: string;
  /** 头像地址url **/
  avatarUrl?: StringOrFn;
}

export interface IdCardFrontInfo {
  canvas: CanvasEntity;
  dataUrl: string;
  idNo: string,
  name: string,
  address: string,
}

/**
 * 生成身份证人像面
 * @param {IdCardOptions} options
 */
export const genIdCardFront = async (options: IdCardOptions):  Promise<IdCardFrontInfo> => {
  const {
    canvas: outCanvas,
    name,
    idNo,
    nationality = "汉",
    address,
    bgUrl = bgImgUrl,
    avatarUrl,
  } = options || {};

  if (!name || !idNo) {
    throw new Error(`genIdCardFront缺少name(姓名)或idNo(身份证号)参数`);
  }

  if (!idNoUtils.validate(idNo)) {
    throw new Error("身份证号不合法");
  }

  const canvas = getCanvas(outCanvas);
  // 考虑没有画布创建的情况
  if (!canvas) {
    throw new Error("无法创建画布，请检查是否传递了正确的canvas字段");
  }
  const ctx = canvas.getContext("2d") as CanvasContext2DType;

  // 创建一个新Image对象，加载身份证底纹图
  await loadBackground(canvas, bgUrl);
  // 加载头像
  const avatarInfo = await loadAvatar(
    canvas,
    idNo,
    avatarUrl
  );

  if (!avatarInfo) {
    throw new Error("无法解析身份证及头像信息");
  }

  const { left, year, month, day, sexDesc } = avatarInfo;

  // 绘制人像到canvas上
  const textMaxWidth = left - 130;

  const startX = 45,
    startY = 65,
    gap = 55;
  // 添加姓名和人像元素
  ctx.font = "bold 18px SimHei"; // 设置字体大小和样式
  ctx.fillStyle = "#1390d6"; // 设置字体颜色
  ctx.looseText("姓名", startX, startY, 8);
  ctx.looseText("性别", startX, startY + gap, 8);
  ctx.looseText("民族", startX + 130, startY + gap, 8);
  ctx.looseText("出生", startX, startY + gap * 2, 8);
  ctx.fillText("年", startX + 130, startY + gap * 2);
  ctx.fillText("月", startX + 200, startY + gap * 2);
  ctx.fillText("日", startX + 270, startY + gap * 2);
  ctx.looseText("住址", startX, startY + gap * 3, 8);
  ctx.font = "bold 20px SimHei"; // 设置字体大小和样式
  ctx.looseText("公民身份号码", startX - 8, startY + gap * 5 + 10, 2);

  ctx.font = "bold 20px 'Microsoft Yahei'"; // 设置字体大小和样式
  ctx.fillStyle = "#000"; // 设置字体颜色
  const valGap = 3.5 * 18;
  ctx.looseText(name, startX + valGap, startY, 1);
  ctx.fillText(sexDesc, startX + valGap, startY + gap);
  // 固定汉族
  ctx.fillText(nationality, startX + 130 + valGap, startY + gap);
  ctx.fillText(year + "", startX + valGap, startY + gap * 2);
  ctx.fillText(month + "", startX + 170, startY + gap * 2);
  ctx.fillText(day + "", startX + 230, startY + gap * 2);

  const realAddress = address || buildAddrByIdNo(idNo);
  ctx.flexibleText(
      realAddress,
    startX + valGap,
    startY + gap * 3,
    textMaxWidth,
    28,
    2
  );
  ctx.font = "bold 26px 'Trebuchet MS'"; // 设置字体大小和样式
  ctx.looseText(idNo, startX + 4.5 * 18 + valGap, startY + gap * 5 + 10, 2.5);

  return {
    canvas,
    dataUrl: canvas.toDataURL(),
    idNo,
    name,
    address: realAddress,
  };
};


/**
 * 随机生成一个身份证
 */
export async function randomIdCardFront(): Promise<IdCardFrontInfo>;
export async function randomIdCardFront(name: string): Promise<IdCardFrontInfo>;
export async function randomIdCardFront(idNo: string): Promise<IdCardFrontInfo>;
export async function randomIdCardFront(name: string, idNo: string): Promise<IdCardFrontInfo>;
export async function randomIdCardFront (nameOrIdNo?: string, idNo?: string): Promise<IdCardFrontInfo> {
  let name = nameOrIdNo;
  // 无参的情况
  if (nameOrIdNo === undefined && idNo === undefined) {
    name = mock("@cname"); // 随机生成姓名
    idNo = idNoUtils.generate(); // 随机生成身份证号
  }
  // 只有一个参数的情况
  if (nameOrIdNo && idNo === undefined) {
    const isIdNo = /^\d{17}(\d|X|x)$/.test(nameOrIdNo);
    if (isIdNo) {
      name = mock("@cname"); // 随机生成姓名
      idNo = nameOrIdNo
    } else {
      if (/^\d/.test(nameOrIdNo)) {
        throw new Error("请检查身份证号是否正确?");
      }
      idNo = idNoUtils.generate(); // 随机生成身份证号
    }
  }
  const address = buildAddrByIdNo(idNo!);
  return genIdCardFront({
    name,
    idNo,
    address,
  })
}

// 加载人像
export type AvatarInfo = IdCardInfo & {
  image: ImageEntity,
  left: number,
  top: number,
  width: number,
  height: number,
  sexDesc: string,
}
const loadAvatar = async (canvas: CanvasEntity, idNo: string, avatarUrl?: StringOrFn ): Promise<Nullable<AvatarInfo>> => {
  const idNoInfo = parseIdCard(idNo);
  if (!canvas || !idNoInfo) return null;
  const ctx = canvas.getContext("2d");
  const { sexDesc, ...others } = idNoInfo;
  avatarUrl =
    avatarUrl || (sexDesc === "女" ? womanAvatarUrl : manAvatarUrl);
  if (typeof avatarUrl === "function") {
    avatarUrl = avatarUrl(idNoInfo);
  }
  const image = await loadImage(avatarUrl!);

  // const ratio = image.naturalWidth / image.naturalHeight;
  const width = Math.round(canvas.width * 0.3);
  // const height = Math.round(width / ratio);
  const height = Math.round(canvas.height * 0.58);
  const left = canvas.width - width - 50;
  const top = canvas.height - height - 110;

  // 绘制人像到canvas上
  // @ts-ignore TODO
  ctx.drawImage(image, left, top, width, height); // 绘制人像，位置和尺寸可调整

  return {
    ...others,
    image,
    left,
    top,
    width,
    height,
    sexDesc,
  };
};