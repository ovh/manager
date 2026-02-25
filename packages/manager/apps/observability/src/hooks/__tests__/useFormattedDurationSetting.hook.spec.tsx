import { renderHook } from '@testing-library/react';
import { enGB, fr } from 'date-fns/locale';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import { useFormattedDurationSetting } from '@/hooks/useFormattedExtraSettings.hook';
import { InfraStructureExtraSettingsDuration } from '@/types/infrastructures.type';

vi.mock('@/hooks/useDateFnsLocale.hook', () => ({
  useDateFnsLocale: vi.fn(),
}));

const mockUseDateFnsLocale = vi.mocked(useDateFnsLocale);

describe('useFormattedDurationSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDateFnsLocale.mockReturnValue(enGB);
  });

  it('should return undefined when setting is undefined', () => {
    const { result } = renderHook(() => useFormattedDurationSetting(undefined));

    expect(result.current).toBeUndefined();
  });

  describe('duration formatting with different units', () => {
    it.each([
      {
        setting: { default: '7d', min: '7d', max: '400d' },
        expected: {
          unit: 'd',
          default: { value: 7, label: '7 days' },
          min: { value: 7, label: '7 days' },
          max: { value: 400, label: '400 days' },
        },
        description: 'days unit',
      },
      {
        setting: { default: '12h', min: '1h', max: '48h' },
        expected: {
          unit: 'h',
          default: { value: 12, label: '12 hours' },
          min: { value: 1, label: '1 hour' },
          max: { value: 2, label: '2 days' }, // 48h converts to 2 days in formatting
        },
        description: 'hours unit',
      },
      {
        setting: { default: '30m', min: '5m', max: '60m' },
        expected: {
          unit: 'm',
          default: { value: 30, label: '30 minutes' },
          min: { value: 5, label: '5 minutes' },
          max: { value: 60, label: '60 minutes' },
        },
        description: 'minutes unit',
      },
      {
        setting: { default: '45s', min: '10s', max: '120s' },
        expected: {
          unit: 's',
          default: { value: 45, label: '45 seconds' },
          min: { value: 10, label: '10 seconds' },
          max: { value: 120, label: '120 seconds' },
        },
        description: 'seconds unit',
      },
    ])('should format $description correctly', ({ setting, expected }) => {
      const { result } = renderHook(() =>
        useFormattedDurationSetting(setting as InfraStructureExtraSettingsDuration),
      );

      expect(result.current).toEqual(expected);
    });
  });

  describe('hours to days conversion', () => {
    it.each([
      { input: '168h', expectedValue: 7, expectedLabel: '7 days', description: '168h to 7 days' },
      { input: '24h', expectedValue: 1, expectedLabel: '1 day', description: '24h to 1 day' },
      {
        input: '720h',
        expectedValue: 30,
        expectedLabel: '30 days',
        description: '720h to 30 days',
      },
    ])('should convert $description', ({ input, expectedValue, expectedLabel }) => {
      const setting: InfraStructureExtraSettingsDuration = { default: input, type: 'DURATION' };

      const { result } = renderHook(() => useFormattedDurationSetting(setting));

      expect(result.current?.unit).toBe('d');
      expect(result.current?.default.value).toBe(expectedValue);
      expect(result.current?.default.label).toBe(expectedLabel);
    });
  });

  describe('optional min/max handling', () => {
    it.each([
      {
        setting: { default: '30d', type: 'DURATION' as const },
        expectedMin: undefined,
        expectedMax: undefined,
        description: 'without min and max',
      },
      {
        setting: { default: '14d', min: '7d', type: 'DURATION' as const },
        expectedMin: { value: 7, label: '7 days' },
        expectedMax: undefined,
        description: 'with only min',
      },
      {
        setting: { default: '14d', max: '365d', type: 'DURATION' as const },
        expectedMin: undefined,
        expectedMax: { value: 365, label: '365 days' },
        description: 'with only max',
      },
    ])('should handle setting $description', ({ setting, expectedMin, expectedMax }) => {
      const { result } = renderHook(() =>
        useFormattedDurationSetting(setting as InfraStructureExtraSettingsDuration),
      );

      expect(result.current?.min).toEqual(expectedMin);
      expect(result.current?.max).toEqual(expectedMax);
    });
  });

  describe('localization', () => {
    it.each([
      { locale: enGB, expectedLabel: '7 days', description: 'English' },
      { locale: fr, expectedLabel: '7 jours', description: 'French' },
    ])('should use $description locale for formatting', ({ locale, expectedLabel }) => {
      mockUseDateFnsLocale.mockReturnValue(locale);

      const setting: InfraStructureExtraSettingsDuration = {
        default: '7d',
        min: '1d',
        max: '30d',
        type: 'DURATION',
      };

      const { result } = renderHook(() => useFormattedDurationSetting(setting));

      expect(result.current?.default.label).toBe(expectedLabel);
    });

    it('should update when locale changes', () => {
      mockUseDateFnsLocale.mockReturnValue(enGB);

      const setting: InfraStructureExtraSettingsDuration = { default: '7d', type: 'DURATION' };

      const { result, rerender } = renderHook(() => useFormattedDurationSetting(setting));

      expect(result.current?.default.label).toBe('7 days');

      mockUseDateFnsLocale.mockReturnValue(fr);
      rerender();

      expect(result.current?.default.label).toBe('7 jours');
    });
  });

  describe('reactivity', () => {
    it('should update when setting changes', () => {
      const initialSetting: InfraStructureExtraSettingsDuration = {
        default: '7d',
        type: 'DURATION',
      };

      const { result, rerender } = renderHook(
        ({ setting }) => useFormattedDurationSetting(setting),
        { initialProps: { setting: initialSetting } },
      );

      expect(result.current?.default.value).toBe(7);

      const newSetting: InfraStructureExtraSettingsDuration = { default: '14d', type: 'DURATION' };
      rerender({ setting: newSetting });

      expect(result.current?.default.value).toBe(14);
    });
  });

  describe('complex duration formats', () => {
    it('should handle complex duration like 1h30m', () => {
      const setting: InfraStructureExtraSettingsDuration = { default: '1h30m', type: 'DURATION' };

      const { result } = renderHook(() => useFormattedDurationSetting(setting));

      // parseObservabilityDurationValue returns hours when hours > 0
      expect(result.current?.unit).toBe('h');
      expect(result.current?.default.value).toBe(1);
      expect(result.current?.default.label).toBe('1 hour 30 minutes');
    });
  });
});
