import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import Dashboard from '@/pages/services/[serviceId]/dashboard/Dashboard.page';
import * as metricApi from '@/data/api/database/metric.api';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as maintenanceApi from '@/data/api/database/maintenance.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import {
  mockMetric,
  mockMetricCpu,
  mockMetricDisk,
  mockMetricMem,
} from '@/__tests__/helpers/mocks/metrics';
import { mockedVrack } from '@/__tests__/helpers/mocks/network';
import {
  mockedMaintenance,
  mockedMaintenanceBis,
  mockedMaintenanceTer,
} from '@/__tests__/helpers/mocks/maintenances';

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/metric.api', () => ({
      getMetrics: vi.fn(() => [
        mockMetric.name,
        mockMetricCpu.name,
        mockMetricDisk.name,
        mockMetricMem.name,
      ]),
    }));

    vi.mock('@/data/api/database/maintenance.api', () => ({
      getMaintenances: vi.fn(() => [mockedMaintenance]),
    }));

    vi.mock('@/data/api/network/network.api', () => ({
      networkApi: {
        getVrack: vi.fn(() => [mockedVrack]),
      },
    }));

    vi.mock('/chart.js', () => ({
      Chart: vi.fn(() => null),
    }));

    vi.mock('react-chartjs-2', () => ({
      Line: vi.fn(() => null),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedServiceOrig,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
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
        })),
        useNavigation: () => ({
          getURL: vi.fn(
            (app: string, path: string) => `#mockedurl-${app}${path}`,
          ),
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and shows skeletons while loading', async () => {
    vi.mocked(metricApi.getMetrics).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('dashboard-metrics-skeleton'),
    ).toBeInTheDocument();
  });

  it('renders and shows each elements of the page', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('dashboard-upgrade-button'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('dashboard-metrics-container'),
      ).toBeInTheDocument();
      const mockMetricCardTestId = `dashboard-metrics-card-${mockMetric.name}`;
      expect(screen.getByTestId(mockMetricCardTestId)).toBeInTheDocument();
      const mockMetricMemCardTestId = `dashboard-metrics-card-${mockMetricMem.name}`;
      expect(screen.getByTestId(mockMetricMemCardTestId)).toBeInTheDocument();
      const mockMetricDiskCardTestId = `dashboard-metrics-card-${mockMetricDisk.name}`;
      expect(screen.getByTestId(mockMetricDiskCardTestId)).toBeInTheDocument();
      expect(
        screen.getByTestId('dashboard-metrics-card-mem_usage'),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('connection-details-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('dashboard-maintenance-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('dashboard-vrack-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('dashboard-copy-id-button'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-billing-link')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-support-link')).toBeInTheDocument();
    });
  });
  it('renders and trigger copy Id in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedServiceOrig.id)).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('dashboard-copy-id-button'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedServiceOrig.id,
      );
    });
  });
});

describe('Maintenance section', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedServiceOrig,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
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
        })),
        useNavigation: () => ({
          getURL: vi.fn(
            (app: string, path: string) => `#mockedurl-${app}${path}`,
          ),
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and shows 1 maintenance', async () => {
    vi.mocked(maintenanceApi.getMaintenances).mockResolvedValueOnce([
      mockedMaintenanceBis,
    ]);
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('dashboard-upgrade-button'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('one-maintenance-span')).toBeInTheDocument();
    });
  });

  it('renders and shows many maintenance', async () => {
    vi.mocked(maintenanceApi.getMaintenances).mockResolvedValueOnce([
      mockedMaintenanceBis,
      mockedMaintenanceTer,
    ]);
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('dashboard-upgrade-button'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('many-maintenance-span')).toBeInTheDocument();
    });
  });
});

describe('Connection details page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: {
          ...mockedServiceOrig,
          endpoints: [
            {
              component: database.service.endpoint.ComponentEnum.mongodb,
              domain: 'domain',
              path: 'path',
              port: 1,
              scheme: 'scheme',
              ssl: true,
              sslMode: 'sslMode',
              uri: 'uri',
            },
            {
              component: database.service.endpoint.ComponentEnum.mongodbSrv,
              domain: 'domain1',
              path: 'path1',
              port: 2,
              scheme: 'scheme1',
              ssl: true,
              sslMode: 'sslMode1',
              uri: 'uri1',
            },
          ],
        },
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
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
        })),
        useNavigation: () => ({
          getURL: vi.fn(
            (app: string, path: string) => `#mockedurl-${app}${path}`,
          ),
        }),
      };
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders and shows each connection details elements of the page', async () => {
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('dashboard-upgrade-button'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('dashboard-connection-detail-select'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedServiceOrig.endpoints[0].domain),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedServiceOrig.endpoints[0].port),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedServiceOrig.endpoints[0].scheme),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedServiceOrig.endpoints[0].uri),
      ).toBeInTheDocument();
    });
  });
  it('renders and trigger copy domain in clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedServiceOrig.endpoints[0].domain),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(
        screen.getByTestId('dashboard-connection-detail-domain-button'),
      );
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedServiceOrig.endpoints[0].domain,
      );
    });
  });
  it('renders and trigger copy uriin clipboard', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    render(<Dashboard />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedServiceOrig.endpoints[0].uri),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(
        screen.getByTestId('dashboard-connection-detail-uri-button'),
      );
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockedServiceOrig.endpoints[0].uri,
      );
    });
  });
});
