
/**
 * 格式化分钟数
 * 备注： 薪人薪事那边默认分钟是以个数为5或者0来提交的
 * @param {number} min
 * @param type 签到开始或者结束时间。 因为开始需要往后抹，结束需要往前抹。
 * @returns {number}
 */
export default function formatMin(min: number, type: "start" | "end"): number {
  let [min_left, min_right] = (min / 10)
    .toFixed(1)
    .split(".")
    .map(e => parseInt(e));
  if (min_right >= 0 && min_right < 5) {
    min_right = type === "start" ? 5 : 0;
  } else if(min_right > 5){
    min_right = type === "start" ? 0 : 5;
  }
  return min_left * 10 + min_right;
};
