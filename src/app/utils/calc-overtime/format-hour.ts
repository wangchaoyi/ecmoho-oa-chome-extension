

/**
 * 格式化加班小时。
 * 备注：取一位小数点。 例如： 2.46， 实际数值为2.4
 */
export default function formatHour(hour: number): number | null{
  let _temp = hour.toString().match(/(\d+)(\.(\d))?/);
  if (_temp) {
    return parseInt(String(hour*10))/10
  } else {
    return null;
  }
};