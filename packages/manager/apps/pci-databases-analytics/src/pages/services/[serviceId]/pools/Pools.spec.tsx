import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as ServiceContext from '@/pages/services/[serviceId]/Service.context';
import Pools, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/pools/Pools.page';
import * as database from '@/types/cloud/project/database';
import * as poolsApi from '@/data/api/database/connectionPool.api';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedConnectionPool } from '@/__tests__/helpers/mocks/connectionPool';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { CdbError } from '@/data/api/database';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  engine: database.EngineEnum.postgresql,
  capabilities: {
    connectionPools: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};
const mockCertificate = { ca: 'certificateCA' };
const mockedUsedNavigate = vi.fn();

describe('Connection pool page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/connectionPool.api', () => ({
      getConnectionPools: vi.fn(() => [mockedConnectionPool]),
      addConnectionPool: vi.fn((connectionPool) => connectionPool),
      deleteConnectionPool: vi.fn(),
      editConnectionPool: vi.fn((connectionPool) => connectionPool),
    }));

    vi.mock('@/data/api/database/database.api', () => ({
      getServiceDatabases: vi.fn(() => [mockedDatabase]),
    }));

    vi.mock('@/data/api/database/user.api', () => ({
      getUsers: vi.fn(() => [mockedDatabaseUser]),
    }));

    vi.mock('@/data/api/database/certificate.api', () => ({
      getCertificate: vi.fn(() => mockCertificate),
      // test
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
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
      };
    });
  });

  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });

  it('renders and shows skeletons while loading', async () => {
    vi.mocked(poolsApi.getConnectionPools).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('connectionPools-table-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows connection pool table', async () => {
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedConnectionPool.name)).toBeInTheDocument();
    });
  });
  it('displays add connection pool button if capability is present', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          connectionPools: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('pools-add-button')).toBeInTheDocument();
  });
  it('does not display add connection pool button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {},
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('pools-add-button')).toBeNull();
  });

  it('disable add connection pool button if capability is disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          connectionPools: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    const addButton = screen.queryByTestId('pools-add-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
});

describe('Open modals', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('pools-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    const actionButton = screen.getByTestId(buttonId);
    await waitFor(() => {
      expect(actionButton).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(actionButton);
    });
  };
  beforeEach(async () => {
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
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedConnectionPool.name)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open add pool modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('pools-add-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });

  it('shows edit pool modal', async () => {
    await openButtonInMenu('pools-action-edit-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./edit/${mockedConnectionPool.id}`,
      );
    });
  });

  it('shows delete pool modal', async () => {
    await openButtonInMenu('pools-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./delete/${mockedConnectionPool.id}`,
      );
    });
  });

  it('shows info pool modal and button to copy info are working', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    await openButtonInMenu('pools-action-info-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./informations/${mockedConnectionPool.id}`,
      );
    });
  });
});
