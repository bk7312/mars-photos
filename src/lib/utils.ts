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
