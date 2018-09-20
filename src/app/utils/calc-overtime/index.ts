import { Moment } from "moment";
import { IOvertime } from "../../types/interface";
import formatMin from "./format-min";
import moment from "moment";
import formatHour from "./format-hour";
import calcTimeRange from "./calc-time-range";


/**
 * 计算加班时间
 *
 * 注： 1. 如果是工作日，判断当天8点后的加班时间。
 *     3. 默认工作日只需要传一个签退时间，如果传了签到时间和isWeekDay为否，那么则认定为周末加班或者节假日加班，以注2计算。
 *     4. 如果传入的参数无法计算，出错则返回-1。控制台会打印警告
 * @param params
 * @returns {number} 返回加班的小时数。 例如：工作日加班到9点，则返回1
 */
export default function calcOverTime(params: {
  isWeekDay: boolean;
  signInAt: Moment;
  signOutAt: Moment;
}): IOvertime | null {
  const { isWeekDay, signInAt, signOutAt } = params;

  signInAt.minute(formatMin(signInAt.minute()));
  signOutAt.minute(formatMin(signOutAt.minute()));

  if (isWeekDay && signOutAt.hour() < 20) {
    return null;
  }

  let overTime: number;
  if (isWeekDay) {
    if (signOutAt.hour() < 20) {
      return null;
    }
    let startTime = moment(`${signInAt.format("YYYY-MM-DD")} 20:00:00`);
    overTime = (signOutAt.valueOf() - startTime.valueOf()) / (3600 * 1000);
  } else {
    overTime = (signOutAt.valueOf() - signInAt.valueOf()) / (3600 * 1000);
    if (signInAt.hour() <= 12 && signOutAt.hour() >= 13) {
      overTime--;
    }
  }

  let hour = formatHour(overTime);
  if (hour === null) {
    return null;
  }
  return {
    hour,
    ...calcTimeRange(isWeekDay, signInAt, signOutAt)
  };
}