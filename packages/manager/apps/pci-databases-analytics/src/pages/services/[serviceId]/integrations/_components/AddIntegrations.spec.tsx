import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import Integrations from '@/pages/services/[serviceId]/integrations/Integrations.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as integrationApi from '@/data/api/database/integration.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

import {
  mockedCapaInteGrafDash,
  mockedCapaInteGrafData,
  mockedCapaInteGrafOpen,
} from '@/__tests__/helpers/mocks/integrations';
import {
  mockedServiceInteBase,
  mockedServiceInteGraf,
  mockedServiceInteM3DB,
  mockedServiceInteMySQL,
} from '@/__tests__/helpers/mocks/services';
import { handleSelectOption } from '@/__tests__/helpers/selectHelper';

describe('Integrations page', () => {
  beforeEach(() => {
    // Mock scroll html function
    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/integration.api', () => ({
      getServiceIntegrations: vi.fn(() => []),
      getServiceCapabilitiesIntegrations: vi.fn(() => [
        mockedCapaInteGrafDash,
        mockedCapaInteGrafData,
        mockedCapaInteGrafOpen,
      ]),
      addIntegration: vi.fn((integration) => integration),
      deleteIntegration: vi.fn(),
    }));

    vi.mock('@/data/api/database/service.api', () => ({
      getServices: vi.fn(() => [
        mockedServiceInteBase,
        mockedServiceInteGraf,
        mockedServiceInteMySQL,
        mockedServiceInteM3DB,
      ]),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
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
    render(<Integrations />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('integrations-add-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-integrations-modal')).toBeInTheDocument();
      expect(screen.getByTestId('add-integrations-modal')).toBeVisible();
      expect(
        screen.getByTestId('select-integration-trigger'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('select-integration-trigger'),
      ).not.toBeDisabled();
    });
    // open select and chose option
    await handleSelectOption(
      'select-integration-trigger',
      [
        'integrationTypeDescription-grafanaDashboard',
        'integrationTypeDescription-grafanaDatasource',
        'integrationTypeDescription-opensearchLogs',
      ],
      'integrationTypeDescription-grafanaDatasource',
    );

    const inputElement = screen.getByTestId(
      `parameter-${mockedCapaInteGrafData.parameters[0].name}`,
    );
    act(() => {
      fireEvent.input(inputElement, {
        target: {
          value: 'param',
        },
      });
    });

    const inputNumber = screen.getByTestId(
      `parameter-${mockedCapaInteGrafData.parameters[1].name}`,
    );
    act(() => {
      fireEvent.input(inputNumber, {
        target: {
          value: 7,
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('integration-submit-button'));
    });

    // Submit the form
    act(() => {
      fireEvent.click(screen.getByTestId('integration-submit-button'));
    });
    // Check if integration is being added
    await waitFor(() => {
      expect(integrationApi.addIntegration).toHaveBeenCalled();
    });
  });
});
