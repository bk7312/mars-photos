// export const range = (start: number, end?: number, step: number = 1) => {
//   const arr = [];
//   if (typeof end === 'undefined') {
//     end = start;
//     start = 0;
//   }
//   for (let i = start; i < end; i += step) {
//     arr.push(i);
//   }
//   return arr;
// };

export const setWithinRange = (
  num: number,
  min: number,
  max?: number
): number => {
  if (isNaN(num)) {
    return min;
  }
  const withinMin = Math.max(min, num);
  return typeof max === 'undefined' ? withinMin : Math.min(max, withinMin);
};

// export const isSameElementsInArray = (arr1: any[], arr2: any[]) => {
//   if (arr1.length !== arr2.length) {
//     return false;
//   }
//   return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
// };

export const isArrayStringInObjectKey = (
  arr: string[],
  obj: { [key: string]: any }
) => {
  for (let a of arr) {
    if (!(a in obj)) {
      return false;
    }
  }
  return true;
};

// export const findNearestUsingBinarySearch = (
//   arr: any[],
//   target: number,
//   evalArr: (para: any) => any
// ): number => {
//   let min = 0;
//   let max = arr.length;
//   while (min < max) {
//     const mid = (min + max) >> 1;
//     const val = evalArr(arr[mid]);
//     if (val === target) {
//       return mid;
//     }
//     val < target ? (min = mid + 1) : (max = mid);
//   }
//   return min;
// };

export const combineClassNames = (...args: string[]): string => {
  return args.join(' ');
};

export const sleep = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};

export const isReducedMotion = () =>
  window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
