import { computeReadableStringFromDate } from './date.ts';

test('computes a readable string from a date', () => {
  expect(computeReadableStringFromDate(new Date('2022-05-13'))).toBe(
    '13 May 2022',
  );
});
