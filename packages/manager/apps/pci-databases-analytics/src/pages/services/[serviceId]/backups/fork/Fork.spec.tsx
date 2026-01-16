import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import Fork, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/backups/fork/Fork.page';

import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedAvailabilities,
  mockedCapabilities,
  mockedEngineCapabilities,
  mockedRegionCapabilities,
} from '@/__tests__/helpers/mocks/availabilities';

import { mockedUser } from '@/__tests__/helpers/mocks/user';
import * as database from '@/types/cloud/project/database';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { mockedForkService } from '@/__tests__/helpers/mocks/services';
import {
  mockedBackup,
  mockedBackupBis,
} from '@/__tests__/helpers/mocks/backup';
import {
  mockedNetworksFork,
  mockedSubnets,
} from '@/__tests__/helpers/mocks/network';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as ServiceAPI from '@/data/api/database/service.api';

describe('Fork funnel page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
    }));
    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
          environment: {
            getEnvironment: vi.fn(() => ({
              getUser: vi.fn(() => mockedUser),
            })),
          },
        })),
      };
    });

    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedForkService,
        category: 'all',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));

    vi.mock('@/data/api/database/availability.api', () => ({
      getAvailabilities: vi.fn(() => [mockedAvailabilities]),
    }));

    vi.mock('@/data/api/database/capabilities.api', () => ({
      getEnginesCapabilities: vi.fn(() => [mockedEngineCapabilities]),
      getRegionsCapabilities: vi.fn(() => [mockedRegionCapabilities]),
      getCapabilities: vi.fn(() => mockedCapabilities),
    }));

    vi.mock('@/data/api/database/backup.api', () => ({
      getServiceBackups: vi.fn(() => [mockedBackup, mockedBackupBis]),
    }));

    vi.mock('@/data/api/network/network.api', () => ({
      networkApi: {
        getPrivateNetworks: vi.fn(() => mockedNetworksFork),
        getSubnets: vi.fn(() => mockedSubnets),
      },
    }));

    vi.mock('@/data/api/catalog/catalog.api', () => ({
      catalogApi: {
        getCatalog: vi.fn(() => mockedCatalog),
      },
    }));

    vi.mock('@/data/api/database/service.api', () => ({
      addService: vi.fn((service) => service),
    }));

    vi.mock('@datatr-ux/uxlib', async () => {
      const mod = await vi.importActual('@datatr-ux/uxlib');
      const toastMock = vi.fn();
      return {
        ...mod,
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders the skeleton component while loading', async () => {
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('order-funnel-skeleton')).toBeInTheDocument();
    });
  });

  it('renders pitr section and fork error display toast error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'errorCreatingService',
      variant: 'critical',
    };
    vi.mocked(ServiceAPI.addService).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('fork-form-container')).toBeInTheDocument();
      expect(screen.getByTestId('fork-submit-button')).toBeInTheDocument();
      expect(screen.getByTestId('radio-button-pitr')).toBeInTheDocument();
      expect(screen.getByTestId('radio-button-pitr')).not.toBeDisabled();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-pitr'));
    });
    await waitFor(() => {
      expect(screen.getByText('inputSourcePITPlaceholder')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-now'));
    });
    act(() => {
      fireEvent.click(screen.getByTestId('fork-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('Fork Submit button call Add Service and success toast', async () => {
    const successMsg = {
      title: 'successCreatingService',
    };
    render(<Fork />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('radio-button-now'));
    });
    act(() => {
      fireEvent.click(screen.getByTestId('fork-submit-button'));
    });
    await waitFor(() => {
      expect(ServiceAPI.addService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(successMsg);
    });
  });
});
