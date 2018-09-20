
/**
 * 格式化分钟数
 * 备注： 薪人薪事那边默认分钟是以个数为5或者0来提交的
 * @param {number} min
 * @returns {number}
 */
export default function formatMin(min: number): number {
  let [min_left, min_right] = (min / 10)
    .toFixed(1)
    .split(".")
    .map(e => parseInt(e));
  if (min_right >= 0 && min_right < 5) {
    min_right = 0;
  } else {
    min_right = 5;
  }
  return min_left * 10 + min_right;
};
