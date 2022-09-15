import { format } from 'date-fns';

/*
 * Compute a readable string (e.g. '3 February 2022') from a Date
 * @TODO test and handle locale
 */
export function computeReadableStringFromDate(date: Date): string {
  return format(date, 'd LLLL y');
}
