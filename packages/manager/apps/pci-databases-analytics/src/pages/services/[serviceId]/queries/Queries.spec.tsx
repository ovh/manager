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
import Queries, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/queries/Queries.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as queriesApi from '@/data/api/database/queries.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import {
  mockedQueries,
  mockedQueryStatisticsPG,
} from '@/__tests__/helpers/mocks/queries';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  engine: database.EngineEnum.postgresql,
  capabilities: {
    currentQueries: {
      read: database.service.capability.StateEnum.enabled,
    },
    currentQueriesCancel: {
      create: database.service.capability.StateEnum.enabled,
    },
    queryStatistics: {
      read: database.service.capability.StateEnum.enabled,
    },
    queryStatisticsReset: {
      create: database.service.capability.StateEnum.enabled,
    },
  },
};
const mockCancelResponse = { success: true };

describe('Queries page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/queries.api', () => ({
      getCurrentQueries: vi.fn(() => [mockedQueries]),
      cancelCurrentQuery: vi.fn(() => mockCancelResponse),
      getQueryStatistics: vi.fn(() => [mockedQueryStatisticsPG]),
      resetQueryStatistics: vi.fn(),
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
    render(<Queries />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('current-queries-skeleton'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('query-statistics-skeleton'),
      ).toBeInTheDocument();
    });
  });

  it('renders and shows queries table', async () => {
    render(<Queries />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedQueries.applicationName),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockedQueryStatisticsPG.databaseName),
      ).toBeInTheDocument();
    });
  });

  it('no display if both read capabilities is disable', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {},
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Queries />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.queryByTestId('query-statistics-description'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('current-queries-container'),
    ).not.toBeInTheDocument();
  });

  it('does not display reset statistics button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          currentQueries: {
            read: database.service.capability.StateEnum.enabled,
          },
          queryStatistics: {
            read: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Queries />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('current-queries-container')).toBeInTheDocument();
    expect(
      screen.getByTestId('query-statistics-description'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('query-statistics-reset-button')).toBeNull();
  });

  it('disable reset statistics button if capability is in disable', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          currentQueries: {
            read: database.service.capability.StateEnum.enabled,
          },
          queryStatistics: {
            read: database.service.capability.StateEnum.enabled,
          },
          queryStatisticsReset: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Queries />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('current-queries-container')).toBeInTheDocument();
    expect(
      screen.getByTestId('query-statistics-description'),
    ).toBeInTheDocument();
    const resetButton = screen.queryByTestId('query-statistics-reset-button');
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toBeDisabled();
  });
});

describe('Action of queries and statistics', () => {
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('current-queries-action-trigger');
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
    vi.restoreAllMocks();
    vi.mocked(ServiceContext.useServiceData).mockReturnValue({
      projectId: 'projectId',
      service: mockedService,
      category: 'operational',
      serviceQuery: {} as UseQueryResult<database.Service, Error>,
    });
    render(<Queries />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByText(mockedQueries.applicationName),
      ).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should reset query statistices', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('query-statistics-reset-button'));
    });
    await waitFor(() => {
      expect(queriesApi.resetQueryStatistics).toHaveBeenCalled();
    });
  });
  it('cancel current query', async () => {
    await openButtonInMenu('current-queries-action-cancel-button');
    await waitFor(() => {
      expect(queriesApi.cancelCurrentQuery).toHaveBeenCalled();
    });
  });
});
