/**
 * 指定日期返回星期几
 * @param dateTime 日期字符串 eg: "2015/05/01"
 * @returns {number}
 */
import { IWeek } from "../interface";

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
