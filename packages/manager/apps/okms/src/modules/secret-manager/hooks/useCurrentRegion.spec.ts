import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCurrentRegion } from './useCurrentRegion';
import {
  okmsMock,
  okmsRoubaix1Mock,
  okmsStrasbourg1Mock,
} from '@/mocks/kms/okms.mock';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

const mockUseParams = vi.mocked(useParams);

describe('useCurrentRegion tests suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when okmsId is provided in URL params', () => {
    it('should return the region of the matching okms', () => {
      mockUseParams.mockReturnValue({
        okmsId: okmsRoubaix1Mock.id,
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBe(okmsRoubaix1Mock.region);
    });

    it('should return undefined when okmsId does not match any okms', () => {
      mockUseParams.mockReturnValue({
        okmsId: 'non-existent-okms',
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBeUndefined();
    });

    it('should prioritize okmsId over region parameter when both are present', () => {
      mockUseParams.mockReturnValue({
        okmsId: okmsRoubaix1Mock.id,
        region: 'some-other-region',
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBe(okmsRoubaix1Mock.region);
    });
  });

  describe('when only region is provided in URL params', () => {
    it('should return the region parameter when no okmsId is present', () => {
      mockUseParams.mockReturnValue({
        okmsId: undefined,
        region: 'custom-region',
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBe('custom-region');
    });

    it('should return the region parameter when okmsId is empty string', () => {
      mockUseParams.mockReturnValue({
        okmsId: '',
        region: 'another-region',
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBe('another-region');
    });
  });

  describe('when neither okmsId nor region are provided', () => {
    it('should return undefined when both parameters are undefined', () => {
      mockUseParams.mockReturnValue({
        okmsId: undefined,
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBeUndefined();
    });

    it('should return undefined when both parameters are empty strings', () => {
      mockUseParams.mockReturnValue({
        okmsId: '',
        region: '',
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty okms list', () => {
      mockUseParams.mockReturnValue({
        okmsId: 'okms-1',
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion([]));

      expect(result.current).toBeUndefined();
    });

    it('should handle when useParams returns null values', () => {
      mockUseParams.mockReturnValue({
        okmsId: (null as unknown) as string,
        region: (null as unknown) as string,
      });

      const { result } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBeUndefined();
    });
  });

  describe('hook reactivity', () => {
    it('should update when okms list changes', () => {
      mockUseParams.mockReturnValue({
        okmsId: okmsRoubaix1Mock.id,
        region: undefined,
      });

      const { result, rerender } = renderHook(
        ({ okmsList }) => useCurrentRegion(okmsList),
        {
          initialProps: { okmsList: okmsMock },
        },
      );

      expect(result.current).toBe(okmsRoubaix1Mock.region);

      // Update okms list
      const newOkmsList = [
        {
          ...okmsMock[0],
          region: 'updated-region',
        },
      ];

      rerender({ okmsList: newOkmsList });

      expect(result.current).toBe('updated-region');
    });

    it('should update when URL parameters change', () => {
      mockUseParams.mockReturnValue({
        okmsId: okmsRoubaix1Mock.id,
        region: undefined,
      });

      const { result, rerender } = renderHook(() => useCurrentRegion(okmsMock));

      expect(result.current).toBe(okmsRoubaix1Mock.region);

      // Change URL parameters
      mockUseParams.mockReturnValue({
        okmsId: okmsStrasbourg1Mock.id,
        region: undefined,
      });

      rerender();

      expect(result.current).toBe(okmsStrasbourg1Mock.region);
    });
  });
});
