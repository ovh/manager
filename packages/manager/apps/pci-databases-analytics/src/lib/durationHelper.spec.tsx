import { expect, test } from 'vitest';
import { fr, enGB, es } from 'date-fns/locale';
import {
  durationStringToDuration,
  durationISOStringToShortTime,
  durationToISODurationString,
  convertDurationStringToISODuration,
  durationStringToHuman,
  durationStringToSeconds,
} from '@/lib/durationHelper';

describe('durationStringToDuration', () => {
  test.each([
    ['2Y', { days: 0, hours: 0, minutes: 0, months: 0, seconds: 0, years: 2 }],
    [
      '3M6D4H20m45S',
      { days: 6, hours: 4, minutes: 20, months: 3, seconds: 45, years: 0 },
    ],
    ['', { days: 0, hours: 0, minutes: 0, months: 0, seconds: 0, years: 0 }],
    ['3J', { days: 0, hours: 0, minutes: 0, months: 0, seconds: 0, years: 0 }],
  ])('should convert duration string to the duration', (input, expected) => {
    expect(durationStringToDuration(input)).toStrictEqual(expected);
  });
});

describe('durationISOStringToShortTime', () => {
  test.each([
    ['P1Y3M4DT4H6M40S', '1Y3M4D4H6m40S'],
    ['PT1H52M47S', '1H52m47S'],
    ['P2Y5M6DT', '2Y5M6D'],
  ])(
    'should convert an ISO duration string to short time format',
    (input, expected) => {
      expect(durationISOStringToShortTime(input)).toBe(expected);
    },
  );
});

describe('durationToISODurationString', () => {
  test.each([
    [{ years: 1, months: 3, days: 5 }, 'P1Y3M5D'],
    [
      { years: 2, months: 6, days: 7, hours: 9, minutes: 30, seconds: 45 },
      'P2Y6M7DT9H30M45S',
    ],
    [{ hours: 6, minutes: 45, seconds: 45 }, 'PT6H45M45S'],
  ])('should convert duration to ISO duration string', (input, expected) => {
    expect(durationToISODurationString(input)).toBe(expected);
  });
});

describe('convertDurationStringToISODuration', () => {
  test.each([
    ['2Y5M3D4H50m45S', 'P2Y5M3DT4H50M45S'],
    ['3Y6M7D', 'P3Y6M7D'],
    ['3H45m50S', 'PT3H45M50S'],
  ])(
    'should convert a string of duration to an ISO duration',
    (input, expected) => {
      expect(convertDurationStringToISODuration(input)).toBe(expected);
    },
  );
});

describe('durationStringToHuman', () => {
  test.each([
    [
      'P2Y5M3DT4H50M45S',
      fr,
      '2 ans, 5 mois, 3 jours, 4 heures, 50 minutes, 45 secondes',
    ],
    [
      'P2Y5M3DT4H50M45S',
      enGB,
      '2 years, 5 months, 3 days, 4 hours, 50 minutes, 45 seconds',
    ],
    [
      'P2Y5M3DT4H50M45S',
      es,
      '2 años, 5 meses, 3 días, 4 horas, 50 minutos, 45 segundos',
    ],
  ])(
    'should convert a duration string to an understandable duration',
    (input, locale, expected) => {
      expect(durationStringToHuman(input, locale)).toBe(expected);
    },
  );
});

describe('durationStringToSeconds', () => {
  test.each([
    ['', 0],
    ['5S', 5],
    ['3m', 180],
    ['2H', 7200],
    ['6M', 15768000],
    ['1Y', 31536000],
    ['2H30m', 9000],
    ['4D5H', 363600],
  ])('should convert a duration to seconds', (input, expected) => {
    expect(durationStringToSeconds(input)).toBe(expected);
  });
});
