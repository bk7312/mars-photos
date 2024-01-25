export const range = (start: number, end?: number, step: number = 1) => {
  const arr = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    arr.push(i);
  }
  return arr;
};

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
