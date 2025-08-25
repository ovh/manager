import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCurrentRegion } from './useCurrentRegion';
import { OKMS } from '@/types/okms.type';
import {
  okmsMock,
  kmsRoubaix1Mock,
  kmsStrasbourg1Mock,
} from '@/mocks/kms/okms.mock';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

const mockUseParams = vi.mocked(useParams);

describe('useCurrentRegion tests suite', () => {
  const mockDomains: OKMS[] = okmsMock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when domainId is provided in URL params', () => {
    it('should return the region of the matching domain', () => {
      mockUseParams.mockReturnValue({
        domainId: kmsRoubaix1Mock.id,
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBe(kmsRoubaix1Mock.region);
    });

    it('should return undefined when domainId does not match any domain', () => {
      mockUseParams.mockReturnValue({
        domainId: 'non-existent-domain',
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBeUndefined();
    });

    it('should prioritize domainId over region parameter when both are present', () => {
      mockUseParams.mockReturnValue({
        domainId: kmsRoubaix1Mock.id,
        region: 'some-other-region',
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBe(kmsRoubaix1Mock.region);
    });
  });

  describe('when only region is provided in URL params', () => {
    it('should return the region parameter when no domainId is present', () => {
      mockUseParams.mockReturnValue({
        domainId: undefined,
        region: 'custom-region',
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBe('custom-region');
    });

    it('should return the region parameter when domainId is empty string', () => {
      mockUseParams.mockReturnValue({
        domainId: '',
        region: 'another-region',
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBe('another-region');
    });
  });

  describe('when neither domainId nor region are provided', () => {
    it('should return undefined when both parameters are undefined', () => {
      mockUseParams.mockReturnValue({
        domainId: undefined,
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBeUndefined();
    });

    it('should return undefined when both parameters are empty strings', () => {
      mockUseParams.mockReturnValue({
        domainId: '',
        region: '',
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty domains array', () => {
      mockUseParams.mockReturnValue({
        domainId: 'domain-1',
        region: undefined,
      });

      const { result } = renderHook(() => useCurrentRegion([]));

      expect(result.current).toBeUndefined();
    });

    it('should handle when useParams returns null values', () => {
      mockUseParams.mockReturnValue({
        domainId: (null as unknown) as string,
        region: (null as unknown) as string,
      });

      const { result } = renderHook(() => useCurrentRegion(mockDomains));

      expect(result.current).toBeUndefined();
    });
  });

  describe('hook reactivity', () => {
    it('should update when domains array changes', () => {
      mockUseParams.mockReturnValue({
        domainId: kmsRoubaix1Mock.id,
        region: undefined,
      });

      const { result, rerender } = renderHook(
        ({ domains }) => useCurrentRegion(domains),
        {
          initialProps: { domains: mockDomains },
        },
      );

      expect(result.current).toBe(kmsRoubaix1Mock.region);

      // Update domains array
      const newDomains = [
        {
          ...mockDomains[0],
          region: 'updated-region',
        },
      ];

      rerender({ domains: newDomains });

      expect(result.current).toBe('updated-region');
    });

    it('should update when URL parameters change', () => {
      mockUseParams.mockReturnValue({
        domainId: kmsRoubaix1Mock.id,
        region: undefined,
      });

      const { result, rerender } = renderHook(() =>
        useCurrentRegion(mockDomains),
      );

      expect(result.current).toBe(kmsRoubaix1Mock.region);

      // Change URL parameters
      mockUseParams.mockReturnValue({
        domainId: kmsStrasbourg1Mock.id,
        region: undefined,
      });

      rerender();

      expect(result.current).toBe(kmsStrasbourg1Mock.region);
    });
  });
});
