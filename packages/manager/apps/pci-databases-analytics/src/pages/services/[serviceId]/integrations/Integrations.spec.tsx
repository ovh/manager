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
import Integrations, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/integrations/Integrations.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as integrationApi from '@/data/api/database/integration.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedServiceInte,
  mockedService as mockedServiceOrig,
} from '@/__tests__/helpers/mocks/services';
import { mockedIntegrations } from '@/__tests__/helpers/mocks/integrations';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { useToast } from '@/components/ui/use-toast';

// Override mock to add capabilities
const mockedNewService = {
  ...mockedServiceOrig,
  capabilities: {
    integrations: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

describe('Integrations page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/integration.api', () => ({
      getServiceIntegrations: vi.fn(() => [mockedIntegrations]),
      addIntegration: vi.fn((integration) => integration),
      deleteIntegration: vi.fn(),
    }));

    vi.mock('@/data/api/database/service.api', () => ({
      getServices: vi.fn(() => [mockedServiceOrig, mockedServiceInte]),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedNewService,
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

    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
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
  it('renders and shows skeletons while loading', async () => {
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('integrations-table-skeleton'),
      ).toBeInTheDocument();
    });
  });
  it('renders and shows integrations table', async () => {
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedIntegrations.type)).toBeInTheDocument();
    });
  });
  it('displays add integrations button if capability is present', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedNewService,
        capabilities: {
          integrations: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('integrations-add-button')).toBeInTheDocument();
  });
  it('does not display add integrations button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedNewService,
        capabilities: {
          integrations: {},
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('integrations-add-button')).toBeNull();
  });
  it('disable add integrations button if capability is disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedNewService,
        capabilities: {
          integrations: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    const addButton = screen.queryByTestId('integrations-add-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
});

describe('Open modals', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('integrations-action-trigger');
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
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedIntegrations.status)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add integrations modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('integrations-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-integrations-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId('add-integrations-modal'), {
        key: 'Escape',
        code: 'Escape',
      });
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-integrations-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('shows delete integrations modal', async () => {
    await openButtonInMenu('integrations-action-delete-button');
    await waitFor(() => {
      expect(
        screen.getByTestId('delete-integrations-modal'),
      ).toBeInTheDocument();
    });
  });
  it('closes delete integrations modal', async () => {
    await openButtonInMenu('integrations-action-delete-button');
    await waitFor(() => {
      expect(
        screen.getByTestId('delete-integrations-modal'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-integrations-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-integrations-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('delete integrations on error trigger toast', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteIntegrationToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(integrationApi.deleteIntegration).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    await openButtonInMenu('integrations-action-delete-button');
    await waitFor(() => {
      expect(
        screen.getByTestId('delete-integrations-modal'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-integrations-submit-button'));
    });
    await waitFor(() => {
      expect(integrationApi.deleteIntegration).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete integrations success', async () => {
    await openButtonInMenu('integrations-action-delete-button');
    await waitFor(() => {
      expect(
        screen.getByTestId('delete-integrations-modal'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-integrations-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-integrations-modal'),
      ).not.toBeInTheDocument();
      expect(integrationApi.deleteIntegration).toHaveBeenCalled();
      expect(integrationApi.getServiceIntegrations).toHaveBeenCalled();
    });
  });
});
