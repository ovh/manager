import { parseISODuration } from './duration';

describe('parseISODuration', () => {
  test.each([
    {
      input: 'P2Y',
      expected: {
        years: 2,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    },
    {
      input: 'P1M',
      expected: {
        years: 0,
        months: 1,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    },
    {
      input: 'P2W',
      expected: {
        years: 0,
        months: 0,
        weeks: 2,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    },
    {
      input: 'P3D',
      expected: {
        years: 0,
        months: 0,
        weeks: 0,
        days: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    },
    {
      input: 'PT1H',
      expected: {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 1,
        minutes: 0,
        seconds: 0,
      },
    },
    {
      input: 'PT3M',
      expected: {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 3,
        seconds: 0,
      },
    },
    {
      input: 'PT5S',
      expected: {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 5,
      },
    },
    {
      input: 'P3Y6M4DT12H30M5S',
      expected: {
        years: 3,
        months: 6,
        weeks: 0,
        days: 4,
        hours: 12,
        minutes: 30,
        seconds: 5,
      },
    },
    {
      input: '',
      expected: {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    },
  ])('should convert $input duration string to $expected', ({ input, expected }) => {
    expect(parseISODuration(input)).toStrictEqual(expected);
  });
});
