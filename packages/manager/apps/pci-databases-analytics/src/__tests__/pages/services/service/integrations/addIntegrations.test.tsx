import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import * as LayoutContext from '@/pages/services/[serviceId]/layout';
import Integrations, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/integrations';
import { database } from '@/models/database';
import { Locale } from '@/hooks/useLocale';
import * as integrationApi from '@/api/databases/integrations';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

import {
  mockedCapaInteGrafDash,
  mockedCapaInteGrafData,
  mockedCapaInteGrafOpen,
  mockedIntegrations,
} from '@/__tests__/helpers/mocks/integrations';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { useToast } from '@/components/ui/use-toast';
import {
  mockedServiceInteBase,
  mockedServiceInteGraf,
  mockedServiceInteM3DB,
  mockedServiceInteMySQL,
} from '@/__tests__/helpers/mocks/services';

describe('Integrations page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/api/databases/integrations', () => ({
      // getServiceIntegrations: vi.fn(() => []),
      getServiceCapabilitiesIntegrations: vi.fn(() => [
        mockedCapaInteGrafDash,
        mockedCapaInteGrafData,
        mockedCapaInteGrafOpen,
      ]),
      addIntegration: vi.fn((integration) => integration),
      deleteIntegration: vi.fn(),
    }));

    vi.mock('@/api/databases/service', () => ({
      getServices: vi.fn(() => [
        mockedServiceInteBase,
        mockedServiceInteGraf,
        mockedServiceInteMySQL,
        mockedServiceInteM3DB,
      ]),
    }));

    vi.mock('@/pages/services/[serviceId]/layout', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedServiceInteBase,
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

  it('open and close add integrations modal', async () => {
    const { rerender } = render(<Integrations />);
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('integrations-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-integrations-modal')).toBeInTheDocument();
      expect(screen.getByTestId('add-integrations-modal')).toBeVisible();
      expect(screen.getByTestId('select-type-button')).toBeInTheDocument();
      expect(screen.getByTestId('select-type-button')).not.toBeDisabled();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('select-type-button'));
      rerender(<Integrations />);
    });

    expect(screen.getByTestId('select-type-button')).not.toHaveAttribute(
      'data-state',
      'closed',
    );
    await waitFor(() => {
      expect(
        screen.getByText(
          'grafanaDashboardintegrationTypeDescription-grafanaDashboard',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'grafanaDatasourceintegrationTypeDescription-grafanaDatasource',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'opensearchLogsintegrationTypeDescription-opensearchLogs',
        ),
      ).toBeInTheDocument();
    });

    const option = screen.getByText(
      'grafanaDatasourceintegrationTypeDescription-grafanaDatasource',
    );
    fireEvent.click(option);
    screen.debug();
    expect(option).toBeInTheDocument();
    expect(option).toHaveAttribute('value', 'grafanaDatasource');

    // await userEvent.click(screen.getByText('grafanaDatasourceintegrationTypeDescription-grafanaDatasource'));
    expect(screen.getByTestId('select-type-button')).toHaveTextContent(
      'grafanaDatasourceintegrationTypeDescription-grafanaDatasource',
    );
    act(() => {
      fireEvent.click(screen.getByTestId('integration-submit-button'));
    });
    await waitFor(() => {
      expect(integrationApi.addIntegration).toHaveBeenCalled();
    });
  });
});
