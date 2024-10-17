import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Services from '@/pages/services/Services.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as serviceApi from '@/data/api/database/service.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';

describe('Services List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: any) => children,
    }));

    vi.mock('@/data/api/database/service.api', () => ({
      getServices: vi.fn(() => [mockedService]),
      editService: vi.fn((service) => service),
      deleteService: vi.fn(),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          category: database.engine.CategoryEnum.all,
        }),
      };
    });
  });

  it('should display services pages and skeleton', async () => {
    render(<Services />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('service-list-table-skeleton'),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByTestId('services-guides-container'),
      ).toBeInTheDocument();
    });
  });

  it('should display services pages and skeleton', async () => {
    vi.mocked(serviceApi.getServices).mockImplementationOnce(() => null);
    render(<Services />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('onbaording-container')).toBeInTheDocument();
    });
  });

  it('should display services list table and add button', async () => {
    render(<Services />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('create-service-button')).toBeInTheDocument();
      expect(screen.getByText(mockedService.id)).toBeInTheDocument();
      expect(screen.getByText(mockedService.description)).toBeInTheDocument();
    });
  });
});

describe('Open modals', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('services-action-trigger');
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
    render(<Services />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedService.id)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows and close rename-service modal', async () => {
    await openButtonInMenu('service-action-rename-button');
    await waitFor(() => {
      expect(screen.getByTestId('rename-service-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.keyDown(screen.getByTestId('rename-service-modal'), {
        key: 'Escape',
        code: 'Escape',
      });
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('rename-service-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('call update service on rename success', async () => {
    await openButtonInMenu('service-action-rename-button');
    await waitFor(() => {
      expect(screen.getByTestId('rename-service-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('rename-service-input'), {
        target: {
          value: 'newName',
        },
      });
      fireEvent.click(screen.getByTestId('rename-service-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('rename-service-modal'),
      ).not.toBeInTheDocument();
      expect(serviceApi.editService).toHaveBeenCalled();
    });
  });

  it('open and close delete service Modal', async () => {
    await openButtonInMenu('service-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-service-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-service-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-service-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('call delete service on success', async () => {
    await openButtonInMenu('service-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-service-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('delete-service-confirmation-input'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-service-confirmation-input'),
        {
          target: {
            value: TERMINATE_CONFIRMATION,
          },
        },
      );
      fireEvent.click(screen.getByTestId('delete-service-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-service-modal'),
      ).not.toBeInTheDocument();
      expect(serviceApi.deleteService).toHaveBeenCalled();
    });
  });
});
