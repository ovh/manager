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
import Namespaces, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/namespaces/Namespace.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as namespaceApi from '@/data/api/database/namespace.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedNamespaces } from '@/__tests__/helpers/mocks/namespaces';
import { CdbError } from '@/data/api/database';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  capabilities: {
    namespaces: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
const mockedUsedNavigate = vi.fn();

describe('Namespaces page', () => {
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
    vi.mock('@/data/api/database/namespace.api', () => ({
      getNamespaces: vi.fn(() => [mockedNamespaces]),
      addNamespace: vi.fn((namespace) => namespace),
      deleteNamespace: vi.fn(),
      editNamespace: vi.fn((namespace) => namespace),
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
    render(<Namespaces />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('namespaces-table-skeleton'),
      ).toBeInTheDocument();
    });
  });
  it('renders and shows namespaces table', async () => {
    vi.mocked(namespaceApi.getNamespaces).mockResolvedValue([mockedNamespaces]);
    render(<Namespaces />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNamespaces.name)).toBeInTheDocument();
    });
  });
  it('displays add namespace button if capability is present', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          namespaces: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Namespaces />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('namespaces-add-button')).toBeInTheDocument();
  });
  it('does not display namespaces button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          namespaces: {},
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Namespaces />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('namespaces-add-button')).toBeNull();
  });
  it('disable add namespaces button if capability is disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          namespaces: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<Namespaces />, { wrapper: RouterWithQueryClientWrapper });
    const addButton = screen.queryByTestId('namespaces-add-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
});

describe('Open modals', () => {
  // Stub the global ResizeObserver
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);

  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('namespaces-action-trigger');
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
    render(<Namespaces />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedNamespaces.name)).toBeInTheDocument();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open add namespaces modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('namespaces-add-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });

  it('shows edit namespaces modal', async () => {
    await openButtonInMenu('namespaces-action-edit-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./edit/namespaceId');
    });
  });

  it('shows delete namespace modal', async () => {
    await openButtonInMenu('namespaces-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete/namespaceId');
    });
  });
});
