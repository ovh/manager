import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { Shell } from '@ovh-ux/shell';
import { useGetHelpUrl, HELP_URL } from './useGetHelpUrl';

const HELP_ROOT = ' https://help.ovhcloud.com/csm';

const createShellMock = (ovhSubsidiary: string) => ({
  getPlugin: vi.fn(() => ({
    getEnvironment: vi.fn(() => ({
      getUser: vi.fn(() => ({ ovhSubsidiary })),
    })),
  })),
});

vi.mock('@/context', () => ({
  useShell: vi.fn(() => createShellMock('FR')),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

const mockUseFeatureAvailability = vi.fn();
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: (features: string[]) => mockUseFeatureAvailability(features),
}));

describe('useGetHelpUrl', () => {
  describe('href', () => {
    it.each([
      ['FR', HELP_URL.FR],
      ['DE', HELP_URL.DE],
      ['ES', HELP_URL.ES],
      ['GB', HELP_URL.GB],
      ['IT', HELP_URL.IT],
      ['US', HELP_URL.US],
      ['CA', HELP_URL.CA],
      ['QC', HELP_URL.QC],
    ])('should return the correct URL for subsidiary %s', async (subsidiary, expectedUrl) => {
      const { useShell } = await import('@/context');
      vi.mocked(useShell).mockReturnValue(createShellMock(subsidiary) as unknown as Shell);
      mockUseFeatureAvailability.mockReturnValue({ data: {} });

      const { result } = renderHook(() => useGetHelpUrl());

      await waitFor(() => {
        expect(result.current.href).toBe(expectedUrl);
      });
    });

    it('should return default HELP_ROOT for unknown subsidiary', async () => {
      const { useShell } = await import('@/context');
      vi.mocked(useShell).mockReturnValue(createShellMock('UNKNOWN') as unknown as Shell);
      mockUseFeatureAvailability.mockReturnValue({ data: {} });

      const { result } = renderHook(() => useGetHelpUrl());

      await waitFor(() => {
        expect(result.current.href).toBe(HELP_ROOT);
      });
    });
  });

  describe('availability', () => {
    it('should return availability as true when feature is available', async () => {
      const { useShell } = await import('@/context');
      vi.mocked(useShell).mockReturnValue(createShellMock('FR') as unknown as Shell);
      mockUseFeatureAvailability.mockReturnValue({
        data: { 'communication:sender-email-addresses': true },
      });

      const { result } = renderHook(() => useGetHelpUrl());

      await waitFor(() => {
        expect(result.current.availability).toBe(true);
      });
    });

    it('should return availability as false when feature is not available', async () => {
      const { useShell } = await import('@/context');
      vi.mocked(useShell).mockReturnValue(createShellMock('FR') as unknown as Shell);
      mockUseFeatureAvailability.mockReturnValue({
        data: { 'communication:sender-email-addresses': false },
      });

      const { result } = renderHook(() => useGetHelpUrl());

      await waitFor(() => {
        expect(result.current.availability).toBe(false);
      });
    });

    it('should return availability as undefined when data is not loaded', async () => {
      const { useShell } = await import('@/context');
      vi.mocked(useShell).mockReturnValue(createShellMock('FR') as unknown as Shell);
      mockUseFeatureAvailability.mockReturnValue({ data: undefined });

      const { result } = renderHook(() => useGetHelpUrl());

      await waitFor(() => {
        expect(result.current.availability).toBeUndefined();
      });
    });
  });
});
