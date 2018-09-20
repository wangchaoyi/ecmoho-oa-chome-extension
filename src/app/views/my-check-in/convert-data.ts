import { calcHasFoodSubsidy, calcOverTime, calcWeek } from "../../utils";
import { ICheckInRecord, IWeek } from "../../types/interface";
import moment from "moment";

/**
 * 转换薪人薪事返回的签到数据
 * 注： 如果选当月，会过滤掉未来的数据
 * @param originData
 * @returns {ICheckInRecord[]}
 */
export default function convertData(originData: any): ICheckInRecord[] {
  if (!originData) return [];
  const list: ICheckInRecord[] = [];
  originData.data.records.forEach((e: any) => {
    if (!e.signTimeList) {
      return;
    }

    let data: ICheckInRecord = {
      date: (() => {
        let ym = originData.data.attendance_md.yearmo;
        ym = `${ym.substr(0, 4)}-${ym.substr(4, 2)}-${
          e.date < 10 ? "0" + e.date : e.date
        }`;
        return ym;
      })(),
      week: 0 as IWeek,
      isWorkDay: Boolean(e.is_workday),
      signInAt:
        e.signTimeList &&
        e.signTimeList[0] &&
        moment(e.signTimeList[0].clockTime * 1000),
      signOutAt:
        e.signTimeList &&
        e.signTimeList[1] &&
        moment(e.signTimeList[1].clockTime * 1000),
      status: "",
      overtime: null
    };

    // 没来到的日期直接跳过
    let isFuture: boolean =
      moment(`${data.date} 00:00:00`).valueOf() > Date.now();
    if (isFuture) {
      return;
    }

    if (data.signInAt && data.signOutAt) {
      data.overtime = calcOverTime({
        isWeekDay: data.isWorkDay,
        signInAt: moment(data.signInAt),
        signOutAt: moment(data.signOutAt)
      });
    }
    data.week = calcWeek(
      moment(data.date + " 00:00:00").format("YYYY/MM/DD")
    ) as IWeek;
    data.hasFoodSubsidy = calcHasFoodSubsidy({
      isWorkDay: data.isWorkDay,
      overTime: data.overtime
    });

    list.push(data);
  });

  return list.reverse();
}
