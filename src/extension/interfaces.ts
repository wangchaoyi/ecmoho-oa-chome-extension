import { EMessageEvent } from "./enums";

export interface IResponse<T> {
  type: EMessageEvent;
  data: T;
}

export interface IDataCheckIn {
  attendance_md: any;
  attendance_statistics: any;
  records: any[];
}
