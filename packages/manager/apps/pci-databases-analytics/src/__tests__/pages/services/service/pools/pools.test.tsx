import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as LayoutContext from '@/pages/services/[serviceId]/layout';
import Pools, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/pools';
import { database } from '@/models/database';
import { Locale } from '@/hooks/useLocale';
import * as connectionPoolApi from '@/api/databases/connectionPool';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedConnectionPool } from '@/__tests__/helpers/mocks/connectionPool';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { useToast } from '@/components/ui/use-toast';

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

describe('ConnectionPools page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/api/databases/connectionPool', () => ({
      getConnectionPools: vi.fn(() => [mockedConnectionPool]),
      addConnectionPool: vi.fn((connectionPool) => connectionPool),
      deleteConnectionPool: vi.fn(),
      editConnectionPool: vi.fn((connectionPool) => connectionPool),
    }));

    vi.mock('@/api/databases/databases', () => ({
      getServiceDatabases: vi.fn(() => [mockedDatabase]),
    }));

    vi.mock('@/api/databases/users', () => ({
      getUsers: vi.fn(() => [mockedUser]),
    }));

    vi.mock('@/api/databases/certificates', () => ({
      getCertificate: vi.fn(() => mockCertificate),
      // test
    }));

    vi.mock('@/pages/services/[serviceId]/layout', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: 'operational',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));

    vi.mock('@ovh-ux/manager-react-shell-client', () => {
      return {
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
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('connectionPools-table-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows connectionPools table', async () => {
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedConnectionPool.name)).toBeInTheDocument();
    });
  });
  it('displays add connection pool button if capability is present', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
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
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('pools-add-button')).toBeInTheDocument();
  });
  it('does not display add connection pool button if capability is absent', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {},
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('pools-add-button')).toBeNull();
  });

  it('disable add connection pool button if capability is disabled', async () => {
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
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
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
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
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
    vi.mocked(LayoutContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Pools />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedConnectionPool.name)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add pools modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('pools-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-pools-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-pools-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-pools-modal'),
      ).not.toBeInTheDocument();
    });
  });
  it('refetch data on add pools success', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('pools-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-pools-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-pools-name-input'), {
        target: {
          value: 'newConnectionPools',
        },
      });
      fireEvent.change(screen.getByTestId('add-edit-pools-size-input'), {
        target: {
          value: 3,
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-pools-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-pools-modal'),
      ).not.toBeInTheDocument();
      expect(connectionPoolApi.addConnectionPool).toHaveBeenCalled();
      expect(connectionPoolApi.getConnectionPools).toHaveBeenCalled();
    });
  });

  it('shows edit pools modal', async () => {
    await openButtonInMenu('pools-action-edit-button');
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-pools-modal')).toBeInTheDocument();
    });
  });

  it('refetch data on edit pools success', async () => {
    await openButtonInMenu('pools-action-edit-button');
    await waitFor(() => {
      expect(screen.getByTestId('add-edit-pools-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-pools-size-input'), {
        target: {
          value: 2,
        },
      });
      fireEvent.click(screen.getByTestId('add-edit-pools-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-pools-modal'),
      ).not.toBeInTheDocument();
      expect(connectionPoolApi.editConnectionPool).toHaveBeenCalled();
      expect(connectionPoolApi.getConnectionPools).toHaveBeenCalled();
    });
  });

  it('shows delete pools modal', async () => {
    await openButtonInMenu('pools-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-pools-modal')).toBeInTheDocument();
    });
  });
  it('closes delete pools modal', async () => {
    await openButtonInMenu('pools-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-pools-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-pools-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-pools-modal'),
      ).not.toBeInTheDocument();
    });
  });
  it('refetch data on delete pools success', async () => {
    await openButtonInMenu('pools-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-pools-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-pools-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-pools-modal'),
      ).not.toBeInTheDocument();
      expect(connectionPoolApi.getConnectionPools).toHaveBeenCalled();
      expect(connectionPoolApi.deleteConnectionPool).toHaveBeenCalled();
    });
  });

  it('shows info pools modal and button to copy info are working', async () => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    await openButtonInMenu('pools-action-info-button');
    await waitFor(() => {
      expect(screen.getByTestId('info-pools-modal')).toBeInTheDocument();
      expect(screen.getByTestId('info-pools-table')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('info-pools-copy-certificate-action'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalled();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('info-pools-copy-uri-action'));
    });
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalled();
    });
  });

  it('closes info pools modal', async () => {
    await openButtonInMenu('pools-action-info-button');
    await waitFor(() => {
      expect(screen.getByTestId('info-pools-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId('info-pools-modal'), {
        key: 'Escape',
        code: 'Escape',
      });
    });
    await waitFor(() => {
      expect(screen.queryByTestId('info-pools-modal')).not.toBeInTheDocument();
    });
  });
});
