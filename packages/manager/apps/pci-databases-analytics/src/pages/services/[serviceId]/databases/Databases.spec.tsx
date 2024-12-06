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
import Databases, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/databases/Database.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as databasesApi from '@/data/api/database/database.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { CdbError } from '@/data/api/database';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    databases: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};
const mockedUsedNavigate = vi.fn();

describe('Databases page', () => {
  beforeEach(() => {
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
    vi.mock('@/data/api/database/database.api', () => ({
      getServiceDatabases: vi.fn(() => [mockedDatabase]),
      addDatabase: vi.fn((user) => user),
      deleteDatabase: vi.fn(),
    }));
    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
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
  it('renders and shows skeletons while loading', async () => {
    vi.mocked(databasesApi.getServiceDatabases).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<Databases />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
  });
  it('renders and shows users table', async () => {
    render(<Databases />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedDatabase.name)).toBeInTheDocument();
    });
  });
  it('displays add user button if capability is present', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          databases: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Databases />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('add-button')).toBeInTheDocument();
  });
  it('does not display add database button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {},
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Databases />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('add-button')).toBeNull();
  });
  it('disable add database button if capability is disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          databases: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Databases />, { wrapper: RouterWithQueryClientWrapper });
    const addButton = screen.queryByTestId('add-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
});

describe('Open modals', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('databases-action-trigger');
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
    render(<Databases />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedDatabase.name)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows add modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('add-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });

  it('shows delete databases modal', async () => {
    await openButtonInMenu('databases-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/databaseId');
    });
  });
});
