/**
 * 指定日期返回星期几
 * @param dateTime 日期字符串 eg: "2015/05/01"
 * @returns {number}
 */
import { IWeek } from "../interface";
import { Moment } from "moment";
import moment = require("moment");

export { default as valiators } from "./validators";

export function calcWeek(dateTime: string) {
  let getWeek = function(y: number, m: number, d: number) {
    let _int = parseInt,
      c = _int((y / 100) as any);

    let tempY = y.toString().substring(2, 4);
    y = _int(tempY, 10);
    if (m === 1) {
      m = 13;
      y--;
    } else if (m === 2) {
      m = 14;
      y--;
    }

    let w =
      y +
      _int((y / 4) as any) +
      _int((c / 4) as any) -
      2 * c +
      _int(((26 * (m + 1)) / 10) as any) +
      d -
      1;
    w = w % 7;

    return w >= 0 ? w : w + 7;
  };

  let list = dateTime.split("/").map(function(element) {
    return parseInt(element);
  });

  return getWeek(list[0], list[1], list[2]);
}

/**
 * 数字星期转中文
 * 范围： 0 - 6
 * 返回： 星期一
 */
export function weekToChinese(week: IWeek): string {
  let dict = {
    0: "星期日",
    1: "星期一",
    2: "星期二",
    3: "星期三",
    4: "星期四",
    5: "星期五",
    6: "星期六"
  };

  return dict[week];
}

/**
 * 计算加班时间
 *
 * 注： 1. 如果是工作日，判断当天8点后的加班时间
 *     2. 如果是非工作日仍然有签到签退记录， 记录完整的时间区域，并且如果跨了中午12点至1点的区间，需要减去1小时
 *     3. 默认工作日只需要传一个签退时间，如果传了签到时间和isWeekDay为否，那么则认定为周末加班或者节假日加班，以注2计算。
 *     4. 如果传入的参数无法计算，出错则返回-1。控制台会打印警告
 * @param params
 * @returns {number} 返回加班的小时数。 例如：工作日加班到9点，则返回1
 */
export function calcOverTime(params: {
  isWeekDay: boolean;
  signInAt: Moment;
  signOutAt: Moment;
}): number {
  const { isWeekDay, signInAt, signOutAt } = params;

  // 格式化小时。
  // 小数不满0.5小时的一律取消掉，大于8小时只按照8小时算。
  // 如果总数小于0.5，则返回-1
  const formatHour = (hour: number): number => {
    let _temp = hour.toString().match(/(\d+)\.(\d)/);
    if (_temp) {
      let num = parseInt(_temp[1]);
      let float = parseInt(_temp[2]);
      if (float >= 5 && float < 10) {
        float = 5;
      } else {
        float = 0;
      }
      let time = num + float / 10;
      if (time === 0) {
        return -1;
      }
      return time > 8 ? 8 : time;
    } else {
      return -1;
    }
  };

  let overTime: number;
  if (isWeekDay) {
    if (signOutAt.hour() < 20) {
      return -1;
    }

    let startTime = moment(`${signInAt.format("YYYY-MM-DD")} 20:00:00`);
    overTime = (signOutAt.valueOf() - startTime.valueOf()) / (3600 * 1000);
  } else {
    overTime = (signOutAt.valueOf() - signInAt.valueOf()) / (3600 * 1000);
    if (signInAt.hour() <= 12 && signOutAt.hour() >= 13) {
      overTime--;
    }
  }

  return formatHour(overTime);
}

/**
 * 判断是否有餐补
 * 注： １．如果是工作日，加班时间需要大于1小时
 * 　　 2. 如果是非工作日， 加班时间需要大于4小时
 * @param params
 */
export function calcHasFoodSubsidy(params: {
  isWorkDay: boolean;
  overTime: number | undefined;
}) {
  const { isWorkDay, overTime } = params;
  if (overTime === undefined) {
    return false;
  }
  if (isWorkDay) {
    return overTime >= 1;
  } else {
    return overTime >= 4;
  }
}
