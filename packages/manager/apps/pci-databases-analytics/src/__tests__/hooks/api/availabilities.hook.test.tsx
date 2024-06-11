import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/api/databases/availabilities';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  useGetAvailabilities,
  useGetCapabilities,
  useGetEnginesCapabilities,
  useGetFullCapabilities,
  useGetRegionsCapabilities,
  useGetSuggestions,
} from '@/hooks/api/availabilities.api.hooks';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedFullCapabilities,
  mockedRegionCapabilities,
  mockedSuggestions,
} from '@/__tests__/helpers/mocks/availabilities';

vi.mock('@/api/databases/availabilities', () => ({
  getAvailabilities: vi.fn(),
  getSuggestions: vi.fn(),
  getCapabilities: vi.fn(),
  getEnginesCapabilities: vi.fn(),
  getRegionsCapabilities: vi.fn(),
}));

describe('useGetAvailabilities', () => {
  it('should return Availabilities', async () => {
    const projectId = 'projectId';
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getAvailabilities).mockResolvedValue([
      mockedAvailabilities,
    ]);

    const { result } = renderHook(
      () => useGetAvailabilities(projectId, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedAvailabilities]);
      expect(databaseAPI.getAvailabilities).toHaveBeenCalledWith({
        projectId,
        serviceId,
      });
    });
  });
});

describe('useGetSuggestions', () => {
  it('should return Suggestions', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getSuggestions).mockResolvedValue([
      mockedSuggestions,
    ]);

    const { result } = renderHook(() => useGetSuggestions(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedSuggestions]);
      expect(databaseAPI.getSuggestions).toHaveBeenCalledWith(projectId);
    });
  });
});

describe('useGetCapabilities', () => {
  it('should return Capabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getCapabilities).mockResolvedValue(
      mockedCapabilities,
    );

    const { result } = renderHook(() => useGetCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedCapabilities);
      expect(databaseAPI.getCapabilities).toHaveBeenCalledWith(projectId);
    });
  });
});

describe('useGetEnginesCapabilities', () => {
  it('should return EnginesCapabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getEnginesCapabilities).mockResolvedValue([
      mockedEngineCapabilities,
    ]);

    const { result } = renderHook(() => useGetEnginesCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedEngineCapabilities]);
      expect(databaseAPI.getEnginesCapabilities).toHaveBeenCalledWith(
        projectId,
      );
    });
  });
});

describe('useGetRegionsCapabilities', () => {
  it('should return RegionsCapabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getRegionsCapabilities).mockResolvedValue([
      mockedRegionCapabilities,
    ]);

    const { result } = renderHook(() => useGetRegionsCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedRegionCapabilities]);
      expect(databaseAPI.getRegionsCapabilities).toHaveBeenCalledWith(
        projectId,
      );
    });
  });
});

describe('useGetFullCapabilities', () => {
  it('should return FullCapabilities', async () => {
    const projectId = 'projectId';

    vi.mocked(databaseAPI.getCapabilities).mockResolvedValue(
      mockedCapabilities,
    );

    vi.mocked(databaseAPI.getEnginesCapabilities).mockResolvedValue([
      mockedEngineCapabilities,
    ]);

    vi.mocked(databaseAPI.getRegionsCapabilities).mockResolvedValue([
      mockedRegionCapabilities,
    ]);

    const { result } = renderHook(() => useGetFullCapabilities(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedFullCapabilities);
      expect(databaseAPI.getRegionsCapabilities).toHaveBeenCalledWith(
        projectId,
      );
    });
  });
});
