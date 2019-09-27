
import { filter, map, split, trim, flattenDepth, range, uniq } from 'lodash';

export function calculateSkipDates(skipDateStr: string): number[] {
  if (undefined === skipDateStr) {
    return [];
  }

  /*
  split by ,
  */
  const splitSkipDates =
    filter(
      map(
        split(skipDateStr, ','),
        (date) => {
          date = trim(date);
          if ('' === date) {
            return null;
          }
          return date;
        }),
      (date) => null != date);
  /*
  split by -
  */
  return uniq(
    flattenDepth<number>(
      map(splitSkipDates,
        dateStr => {
          const splitValues = split(dateStr, '-');
          if (1 === splitValues.length) {
            return parseInt(dateStr);
          }

          console.log(splitValues);
          if (2 !== splitValues.length) {
            throw new Error(`more than two values in range ${dateStr}`);
          }

          const first = parseInt(splitValues[0]);
          const last = parseInt(splitValues[1]);
          const len = last - first;
          if (len < 0) {
            throw new Error(`Incorrect range ${dateStr}`);
          } else if (0 === len) {
            return first;
          }

          return range(first, last + 1);
          // TODO: test 1. out of range, 2. one of range values missing
        }), 1));
}
