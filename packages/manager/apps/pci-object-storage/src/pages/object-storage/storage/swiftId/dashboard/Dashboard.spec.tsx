import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedSwift } from '@/__tests__/helpers/mocks/swift';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useParams: () => ({
      projectId: 'test-project-id',
      swiftId: 'test-swift-id',
    }),
    Outlet: () => null,
  };
});

vi.mock('../Swift.context', () => ({
  useSwiftData: () => ({ swift: mockedSwift }),
}));

const mockUseObjectStorageData = vi.fn();

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: () => mockUseObjectStorageData(),
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({ ovhSubsidiary: 'FR' }),
}));

describe('Dashboard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show skeleton when regions are not loaded', () => {
      mockUseObjectStorageData.mockReturnValue({ regions: undefined });

      render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Dashboard',
      );
      expect(screen.queryByText('dashboardTitle')).not.toBeInTheDocument();
    });
  });

  describe('Loaded state', () => {
    const mockRegions = [
      {
        name: 'GRA',
        status: 'UP',
        services: [
          {
            name: 'storage',
            endpoint: 'https://storage.gra.cloud.ovh.net/v1/AUTH_xxx',
            status: 'UP',
          },
        ],
      },
    ];

    beforeEach(() => {
      mockUseObjectStorageData.mockReturnValue({ regions: mockRegions });
    });

    it('should show dashboard content when regions are loaded', () => {
      render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });

      expect(screen.getByText('dashboardTitle')).toBeInTheDocument();
      expect(screen.getByText('informationTitle')).toBeInTheDocument();
      expect(screen.getByText('configurationTitle')).toBeInTheDocument();
    });
  });
});
