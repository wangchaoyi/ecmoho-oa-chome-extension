import { Moment } from "moment";
import formatMin from "./format-min";

export default function calcTimeRange(
  isWeekDay: boolean,
  signInAt: Moment,
  signOutAt: Moment
): { startTime: Moment; endTime: Moment } {
  let startTime: Moment;
  let endTime: Moment = signOutAt.clone().minute(signOutAt.minute());
  if (isWeekDay) {
    startTime = signInAt
      .clone()
      .hour(20)
      .minute(0)
      .second(0);
  } else {
    startTime = signInAt.clone().minute(formatMin(signInAt.minute(), "start"));
  }
  endTime.minute(formatMin(endTime.minute(), "end"));
  return { startTime, endTime };
}
