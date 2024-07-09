import {genIdCardFront, IdCardFrontInfo, randomIdCardFront} from "./genIdCardFront"
import { genIdCardBack } from "./genIdCardBack"
import { CanvasEntity } from "./my-canvas";

export {
    genIdCardFront,
    genIdCardBack,
    randomIdCardFront,
}


export interface IdCardInfo {
    /** 人像面画布元素 **/
    frontCanvas: CanvasEntity,
    /** 国徽面画布元素 **/
    backCanvas: CanvasEntity,
    /** 人像面图片base64 **/
    frontDataUrl: string;
    /** 国徽面图片base64 **/
    backDataUrl: string,
    /** 身份证号 **/
    idNo: string,
    /** 姓名 **/
    name: string,
    /** 身份证有效期开始日期 **/
    startDate: string,
    /** 身份证有效期结束日期 **/
    endDate: string,
    /** 住址 **/
    address: string,
}

// 随机生成一个身份证
export async function randomIdCard(): Promise<IdCardInfo>;
export async function randomIdCard(name: string): Promise<IdCardInfo>;
export async function randomIdCard(idNo: string): Promise<IdCardInfo>;
export async function randomIdCard(name: string, idNo: string): Promise<IdCardInfo>;
export async function randomIdCard (nameOrIdNo?: string, idNo?: string): Promise<IdCardInfo> {
    let frontInfo: IdCardFrontInfo;
    if (nameOrIdNo === undefined && idNo === undefined) {
        frontInfo = await randomIdCardFront();
    } else if (nameOrIdNo && idNo === undefined) {
        frontInfo = await randomIdCardFront(nameOrIdNo)
    } else {
        frontInfo = await randomIdCardFront(nameOrIdNo!, idNo!)
    }

    const backInfo = await genIdCardBack({ idNo: frontInfo.idNo })

    return {
        frontCanvas: frontInfo.canvas,
        backCanvas: backInfo.canvas,
        frontDataUrl: frontInfo.dataUrl,
        backDataUrl: backInfo.dataUrl,
        idNo: frontInfo.idNo,
        name: frontInfo.name,
        startDate: backInfo.startDate,
        endDate: backInfo.endDate,
        address: frontInfo.address,
    }

}
