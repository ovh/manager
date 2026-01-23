import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useInfrastructureSettings } from '@/data/hooks/infrastructures/useInfrastructureSettings.hook';
import { useInfrastructures } from '@/data/hooks/infrastructures/useInfrastructures.hook';
import { InfraStructureExtraSettings, Infrastructure } from '@/types/infrastructures.type';

vi.mock('@/data/hooks/infrastructures/useInfrastructures.hook', () => ({
  useInfrastructures: vi.fn(),
}));

const mockUseInfrastructures = vi.mocked(useInfrastructures);

describe('useInfrastructureSettings', () => {
  const mockExtraSettings1: InfraStructureExtraSettings = {
    mimir: {
      configurable: {
        compactor_blocks_retention_period: {
          default: '7d',
          min: '7d',
          max: '400d',
          type: 'DURATION',
        },
        max_global_series_per_user: {
          default: 100,
          min: 1,
          max: 1000,
          type: 'NUMERIC',
        },
      },
    },
  };

  const mockExtraSettings2: InfraStructureExtraSettings = {
    mimir: {
      configurable: {
        compactor_blocks_retention_period: {
          default: '14d',
          min: '7d',
          max: '365d',
          type: 'DURATION',
        },
        max_global_series_per_user: {
          default: 200,
          min: 1,
          max: 2000,
          type: 'NUMERIC',
        },
      },
    },
  };

  const mockInfrastructures: Infrastructure[] = [
    {
      id: 'infra-1',
      currentState: {
        entryPoint: 'https://infra-1.example.com',
        location: 'eu-west-1',
        type: 'DEDICATED',
        usage: 'METRICS',
        extraSettings: mockExtraSettings1,
      },
    },
    {
      id: 'infra-2',
      currentState: {
        entryPoint: 'https://infra-2.example.com',
        location: 'us-east-1',
        type: 'SHARED',
        usage: 'METRICS',
        extraSettings: mockExtraSettings2,
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when infrastructures are loaded successfully', () => {
    beforeEach(() => {
      mockUseInfrastructures.mockReturnValue({
        data: mockInfrastructures,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
      } as ReturnType<typeof useInfrastructures>);
    });

    it.each([
      {
        infrastructureId: 'infra-1',
        expectedDefault: '7d',
        expectedMaxSeries: 100,
        description: 'first infrastructure',
      },
      {
        infrastructureId: 'infra-2',
        expectedDefault: '14d',
        expectedMaxSeries: 200,
        description: 'second infrastructure',
      },
    ])(
      'should return extraSettings for $description',
      ({ infrastructureId, expectedDefault, expectedMaxSeries }) => {
        const { result } = renderHook(() =>
          useInfrastructureSettings('resource-1', infrastructureId),
        );

        expect(
          result.current.data?.mimir?.configurable?.compactor_blocks_retention_period.default,
        ).toBe(expectedDefault);
        expect(result.current.data?.mimir?.configurable?.max_global_series_per_user.default).toBe(
          expectedMaxSeries,
        );
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.isError).toBe(false);
      },
    );

    it.each([
      { infrastructureId: 'non-existent-infra', description: 'non-existent infrastructure' },
      { infrastructureId: '', description: 'empty infrastructure ID' },
    ])('should return undefined for $description', ({ infrastructureId }) => {
      const { result } = renderHook(() =>
        useInfrastructureSettings('resource-1', infrastructureId),
      );

      expect(result.current.data).toBeUndefined();
    });

    it('should call useInfrastructures with correct resourceName', () => {
      renderHook(() => useInfrastructureSettings('my-resource', 'infra-1'));

      expect(mockUseInfrastructures).toHaveBeenCalledWith({
        resourceName: 'my-resource',
      });
    });

    it('should update when infrastructureId changes', () => {
      const { result, rerender } = renderHook(
        ({ resourceName, infrastructureId }) =>
          useInfrastructureSettings(resourceName, infrastructureId),
        {
          initialProps: { resourceName: 'resource-1', infrastructureId: 'infra-1' },
        },
      );

      expect(
        result.current.data?.mimir?.configurable?.compactor_blocks_retention_period.default,
      ).toBe('7d');

      rerender({ resourceName: 'resource-1', infrastructureId: 'infra-2' });

      expect(
        result.current.data?.mimir?.configurable?.compactor_blocks_retention_period.default,
      ).toBe('14d');
    });
  });

  describe('when infrastructures data is not available', () => {
    it.each([
      {
        mockReturn: {
          data: undefined,
          isLoading: false,
          error: null,
          isError: false,
          isSuccess: false,
        },
        description: 'undefined data',
      },
      {
        mockReturn: { data: [], isLoading: false, error: null, isError: false, isSuccess: true },
        description: 'empty array',
      },
    ])('should return undefined for $description', ({ mockReturn }) => {
      mockUseInfrastructures.mockReturnValue(mockReturn as ReturnType<typeof useInfrastructures>);

      const { result } = renderHook(() => useInfrastructureSettings('resource-1', 'infra-1'));

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('loading and error states', () => {
    it('should return loading state from useInfrastructures', () => {
      mockUseInfrastructures.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
      } as ReturnType<typeof useInfrastructures>);

      const { result } = renderHook(() => useInfrastructureSettings('resource-1', 'infra-1'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should return error state from useInfrastructures', () => {
      const mockError = new Error('Failed to fetch infrastructures');
      mockUseInfrastructures.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        isError: true,
        isSuccess: false,
      } as ReturnType<typeof useInfrastructures>);

      const { result } = renderHook(() => useInfrastructureSettings('resource-1', 'infra-1'));

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });
});
