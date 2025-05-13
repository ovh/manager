import { describe, expect, it } from 'vitest';
import CronValidator from './cron-validator';

describe('CronValidator', () => {
  const validator = new CronValidator();

  it('validates simple minute and hour cron expression', () => {
    expect(validator.validateCron('30 4 * * *')).toBe(true);
  });

  it('validates cron expression with day, month, and weekday', () => {
    expect(validator.validateCron('15 10 15 * 5')).toBe(true);
  });

  it('rejects invalid minute value in cron expression', () => {
    expect(validator.validateCron('60 4 * * *')).toBe(false);
  });

  it('rejects invalid hour value in cron expression', () => {
    expect(validator.validateCron('30 24 * * *')).toBe(false);
  });

  it('validates cron expression with step values', () => {
    expect(validator.validateCron('*/15 * * * *')).toBe(true);
  });

  it('validates cron expression with range of values', () => {
    expect(validator.validateCron('1-5 * * * *')).toBe(true);
  });

  it('rejects cron expression with invalid range', () => {
    expect(validator.validateCron('5-1 * * * *')).toBe(false);
  });

  it('validates cron expression with list of values', () => {
    expect(validator.validateCron('1,2,3 * * * *')).toBe(true);
  });

  it('validates cron expression with mixed types', () => {
    expect(validator.validateCron('1,*/10,11-13 * * * *')).toBe(true);
  });

  it('validates cron expression with month and weekday aliases', () => {
    expect(
      validator.validateCron('0 0 * Jan Mon', { alias: true, seconds: false }),
    ).toBe(true);
  });

  it('rejects cron expression with invalid month alias', () => {
    expect(
      validator.validateCron('0 0 * Jam *', { alias: true, seconds: false }),
    ).toBe(false);
  });

  it('rejects cron expression with invalid weekday alias', () => {
    expect(
      validator.validateCron('0 0 * * Monn', { alias: true, seconds: false }),
    ).toBe(false);
  });

  it('validates cron expression with seconds', () => {
    expect(
      validator.validateCron('0 30 4 * * *', { seconds: true, alias: false }),
    ).toBe(true);
  });

  it('rejects cron expression with invalid seconds', () => {
    expect(
      validator.validateCron('60 30 4 * * *', { seconds: true, alias: false }),
    ).toBe(false);
  });
});
