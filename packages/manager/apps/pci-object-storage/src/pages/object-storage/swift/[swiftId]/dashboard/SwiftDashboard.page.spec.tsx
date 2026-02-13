import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import Dashboard, { breadcrumb as Breadcrumb } from './SwiftDashboard.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import cloud from '@/types/Cloud';
import { mockedUser } from '@/__tests__/helpers/mocks/user';

const regionMatchingSwift: cloud.Region = {
  ...mockedRegion,
  name: mockedContainerDetail.region,
  services: [
    {
      endpoint: 'https://storage.gra.cloud.ovh.net/v1/AUTH_xxx',
      name: 'storage',
      status: cloud.ServiceStatusEnum.UP,
    },
  ],
};

vi.mock('../Swift.context', () => ({
  useSwiftData: () => ({ swift: mockedContainerDetail }),
}));

vi.mock('@/pages/object-storage/ObjectStorage.context');

vi.mock('@/hooks/useUser', () => ({
  useUser: () => mockedUser,
}));

describe('SwiftDashboard.page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', swiftId: 'test-swift-id' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('dashboardTab')).toBeTruthy();
    });
  });

  describe('Loading state', () => {
    it('should show skeleton when regions are not loaded', () => {
      vi.mocked(useObjectStorageData).mockReturnValue({
        regions: undefined,
      } as ReturnType<typeof useObjectStorageData>);

      render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Dashboard',
      );
      expect(screen.queryByText('dashboardTitle')).not.toBeInTheDocument();
    });
  });

  describe('Loaded state', () => {
    it('should show dashboard content when regions are loaded', () => {
      vi.mocked(useObjectStorageData).mockReturnValue({
        regions: [regionMatchingSwift],
      } as ReturnType<typeof useObjectStorageData>);

      render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });

      expect(screen.getByText('dashboardTitle')).toBeInTheDocument();
      expect(screen.getByText('informationTitle')).toBeInTheDocument();
      expect(screen.getByText('configurationTitle')).toBeInTheDocument();
    });
  });
});
