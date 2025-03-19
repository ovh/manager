import { expect, vi } from 'vitest';
import { fr, enGB, es } from 'date-fns/locale';
import {
  durationStringToDuration,
  durationISOStringToShortTime,
  durationToISODurationString,
  convertDurationStringToISODuration,
  durationStringToHuman,
  convertSecondsToTimeString,
} from '@/lib/durationHelper';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, value: { count: number }) => {
      return `${value.count} ${key}`;
    },
  }),
}));

describe('durationHelper', () => {
  it('durationStringToDuration', () => {
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
  });

  it('durationStringToDuration', () => {
    expect(durationStringToDuration('3J')).toStrictEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      months: 0,
      seconds: 0,
      years: 0,
    });
  });
  it('durationISOStringToShortTime', () => {
    expect(durationISOStringToShortTime('P1Y3M4DT4H6M40S')).toBe(
      '1Y3M4D4H6m40S',
    );
    expect(durationISOStringToShortTime('PT1H52M47S')).toBe('1H52m47S');
    expect(durationISOStringToShortTime('P2Y5M6DT')).toBe('2Y5M6D');
  });

  it('durationToISODurationString', () => {
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

  it('convertDurationStringToISODuration', () => {
    expect(convertDurationStringToISODuration('2Y5M3D4H50m45S')).toBe(
      'P2Y5M3DT4H50M45S',
    );
    expect(convertDurationStringToISODuration('3Y6M7D')).toBe('P3Y6M7D');
    expect(convertDurationStringToISODuration('3H45m50S')).toBe('PT3H45M50S');
  });
  it('durationStringToHuman', () => {
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

  it('convertSecondsToTimeString', () => {
    expect(convertSecondsToTimeString(45, true)).toBe('45s');
    expect(convertSecondsToTimeString(45, false)).toStrictEqual(
      '45 numberOfSeconds',
    );
    expect(convertSecondsToTimeString(75, true)).toBe('1m 15s');
    expect(convertSecondsToTimeString(75, false)).toStrictEqual(
      '1 numberOfMinutes 15 numberOfSeconds',
    );

    expect(convertSecondsToTimeString(3675, true)).toBe('1h 1m 15s');
    expect(convertSecondsToTimeString(3675, false)).toBe(
      '1 numberOfHours 1 numberOfMinutes 15 numberOfSeconds',
    );

    expect(convertSecondsToTimeString(90061, true)).toBe('1d 1h 1m 1s');
    expect(convertSecondsToTimeString(90061, false)).toBe(
      '1 numberOfDays 1 numberOfHours 1 numberOfMinutes 1 numberOfSeconds',
    );
    expect(convertSecondsToTimeString(86400, true)).toBe('1d');
  });
});
