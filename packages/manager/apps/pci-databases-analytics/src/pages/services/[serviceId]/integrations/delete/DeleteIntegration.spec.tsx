import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as integrationsApi from '@/data/api/database/integration.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import DeleteIntegration from './DeleteIntegration.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import {
  mockedCapabilitiesIntegrations,
  mockedIntegrations,
} from '@/__tests__/helpers/mocks/integrations';

describe('Delete integration modal', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          category: database.engine.CategoryEnum.all,
          integrationId: mockedIntegrations.id,
        }),
      };
    });
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/integration.api', () => ({
      getServiceIntegrations: vi.fn(() => [mockedIntegrations]),
      getServiceCapabilitiesIntegrations: vi.fn(() => [
        mockedCapabilitiesIntegrations,
      ]),
      addIntegration: vi.fn(),
      deleteIntegration: vi.fn(),
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
  it('should open the modal', async () => {
    render(<DeleteIntegration />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-integrations-modal'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('delete-integrations-submit-button'),
      ).toBeInTheDocument();
    });
  });
  it('should delete an integration on submit', async () => {
    render(<DeleteIntegration />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-integrations-submit-button'));
    });
    await waitFor(() => {
      expect(integrationsApi.deleteIntegration).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteIntegrationToastSuccessTitle',
        description: 'deleteIntegrationToastSuccessDescription',
      });
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(integrationsApi.deleteIntegration).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteIntegration />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-integrations-submit-button'));
    });
    await waitFor(() => {
      expect(integrationsApi.deleteIntegration).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteIntegrationToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
