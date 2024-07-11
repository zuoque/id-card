import { idNoUtils } from "@zuoque/random-coding"

type DateOrDateStr = Date | string;
/**
 * 判断是否为浏览器环境
 */
export const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * 将日期字符串转换为Date对象
 * @param dateOrDateStr 日期字符串， eg: 2024-12-13 12:12:12
 */
export const toDate = (dateOrDateStr: DateOrDateStr): Nullable<Date> => {
  if (!dateOrDateStr) return null;
  try {
    const date = new Date(dateOrDateStr);
    if (date.toString() === "Invalid Date") return null;
    return date;
  } catch (e) {
    return null;
  }
};

/**
 * 格式化日期字符串
 * @param dateOrDateStr 日期字符串， eg: 2024-12-13 12:12:12
 * @param formatStr 格式化字符串， eg: yyyy-MM-dd HH:mm:ss
 */
export const formatDate = (dateOrDateStr: DateOrDateStr, formatStr = "yyyy-MM-dd HH:mm:ss"): string => {
  const date = toDate(dateOrDateStr);
  // 解析不出来的直接原样返回
  if (!date || !formatStr) return '';
  const _padZero = (number: number, length = 2) => {
    return String(number).padStart(length, '0');
  };
  const replacements = {
    yyyy: date.getFullYear() + "",
    yy: String(date.getFullYear()).slice(-2),
    MM: _padZero(date.getMonth() + 1),
    dd: _padZero(date.getDate()),
    HH: _padZero(date.getHours()),
    mm: _padZero(date.getMinutes()),
    ss: _padZero(date.getSeconds()),
  };

  type ReplaceKeys = keyof typeof replacements;
  return formatStr.replace(/yyyy|yy|MM|dd|HH|mm|ss/g, (match: string) => replacements[match as ReplaceKeys]);
};

/**
 * 解析身份证号中的年月日及性别
 * @param idNo 身份证号
 */
export type IdCardInfo = {
    year: number,
    month: number,
    day: number,
    sex: 0 | 1,
    sexDesc: '女' | '男',
}
export const parseIdCard = (idNo?: string): Nullable<IdCardInfo> => {
  if (!idNo || !idNoUtils.validate(idNo)) return null;
  const year = idNo.substring(6, 10);
  const month = idNo.substring(10, 12);
  const day = idNo.substring(12, 14);
  const sex = Number(idNo.substring(16, 17)) % 2 as IdCardInfo['sex'];
  const sexDesc = sex === 0 ? "女" : "男";
  return {
    year: +year,
    month: +month,
    day: +day,
    sex,
    sexDesc,
  };
};