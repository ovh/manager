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

test('durationStringToDuration', () => {
  expect(durationStringToDuration('2Y')).toStrictEqual({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 2,
  });
  expect(durationStringToDuration('3M6D4H20m45S')).toStrictEqual({
    days: 6,
    hours: 4,
    minutes: 20,
    months: 3,
    seconds: 45,
    years: 0,
  });
  expect(durationStringToDuration('')).toStrictEqual({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  });
  expect(durationStringToDuration('3J')).toStrictEqual({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  });
});

test('durationISOStringToShortTime', () => {
  expect(durationISOStringToShortTime('P1Y3M4DT4H6M40S')).toBe('1Y3M4D4H6m40S');
  expect(durationISOStringToShortTime('PT1H52M47S')).toBe('1H52m47S');
  expect(durationISOStringToShortTime('P2Y5M6DT')).toBe('2Y5M6D');
});

test('durationToISODurationString', () => {
  expect(durationToISODurationString({ years: 1, months: 3, days: 5 })).toBe(
    'P1Y3M5D',
  );
  expect(
    durationToISODurationString({
      years: 2,
      months: 6,
      days: 7,
      hours: 9,
      minutes: 30,
      seconds: 45,
    }),
  ).toBe('P2Y6M7DT9H30M45S');
  expect(
    durationToISODurationString({ hours: 6, minutes: 45, seconds: 45 }),
  ).toBe('PT6H45M45S');
});

test('convertDurationStringToISODuration', () => {
  expect(convertDurationStringToISODuration('2Y5M3D4H50m45S')).toBe(
    'P2Y5M3DT4H50M45S',
  );
  expect(convertDurationStringToISODuration('3Y6M7D')).toBe('P3Y6M7D');
  expect(convertDurationStringToISODuration('3H45m50S')).toBe('PT3H45M50S');
});

test('durationStringToHuman', () => {
  expect(durationStringToHuman('P2Y5M3DT4H50M45S', fr)).toBe(
    '2 ans, 5 mois, 3 jours, 4 heures, 50 minutes, 45 secondes',
  );
  expect(durationStringToHuman('P2Y5M3DT4H50M45S', enGB)).toBe(
    '2 years, 5 months, 3 days, 4 hours, 50 minutes, 45 seconds',
  );
  expect(durationStringToHuman('P2Y5M3DT4H50M45S', es)).toBe(
    '2 años, 5 meses, 3 días, 4 horas, 50 minutos, 45 segundos',
  );
});


describe('durationStringToSeconds', () => {
  it('should return 0 for an empty string', () => {
    expect(durationStringToSeconds('')).toEqual(0);
  });

  it('should return seconds only', () => {
    expect(durationStringToSeconds('5S')).toEqual(5);
  });

  it('should return minutes only', () => {
    expect(durationStringToSeconds('3m')).toEqual(180);
  });

  it('should return hours only', () => {
    expect(durationStringToSeconds('2H')).toEqual(7200);
  });

  it('should return days only', () => {
    expect(durationStringToSeconds('4D')).toEqual(345600);
  });

  it('should return months only', () => {
    expect(durationStringToSeconds('6M')).toEqual(15768000);
  });

  it('should return years only', () => {
    expect(durationStringToSeconds('1Y')).toEqual(31536000);
  });

  it('should return mixed durations', () => {
    expect(durationStringToSeconds('2H30m')).toEqual(9000);
    expect(durationStringToSeconds('4D5H')).toEqual(363600);
  });
});
