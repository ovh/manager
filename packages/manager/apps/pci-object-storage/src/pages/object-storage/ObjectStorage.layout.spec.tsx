import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardLayout, {
  Loader,
} from '@/pages/object-storage/ObjectStorage.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as storagesAPI from '@/data/api/storage/storages.api';
import { mockedStorages } from '@/__tests__/helpers/mocks/storageContainer/storages';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';

const loaderParam = {
  params: {
    projectId: 'projectId',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('ObjectStorage Layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('@/data/api/storage/storages.api', () => ({
      getStorages: vi.fn(() => mockedStorages),
    }));
    vi.mock('@/data/api/user/user.api', () => ({
      getUsers: vi.fn(() => [mockedUser]),
    }));
    vi.mock('@/data/api/region/region.api', () => ({
      getRegions: vi.fn(() => [mockedRegion]),
    }));
    vi.mock('@/hooks/useUser', () => {
      return {
        useUser: vi.fn(() => mockedUser),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls getStorages in Loader', async () => {
    const res = Loader(loaderParam);
    await waitFor(() => {
      expect(storagesAPI.getStorages).toHaveBeenCalled();
    });
    expect(res).toBeInstanceOf(Promise);
  });

  it('renders the DashboardLayout skeleton', async () => {
    render(<DashboardLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('skeleton-container')).toBeInTheDocument();
      expect(
        screen.getByTestId('service-list-table-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders the DashboardLayout component', async () => {
    render(<DashboardLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('containers-guides-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('guide-open-button')).toBeTruthy();
      expect(screen.getByTestId('roadmap-button')).toBeTruthy();
      expect(screen.getByTestId('tab-container')).toBeTruthy();
    });
  });
});
