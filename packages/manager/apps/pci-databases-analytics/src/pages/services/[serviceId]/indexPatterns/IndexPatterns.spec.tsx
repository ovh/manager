import { ReactNode } from 'react';
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
import IndexPatterns, {
  breadcrumb as Breadcrumb,
} from '@/pages/services/[serviceId]/indexPatterns/IndexPatterns.page';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import * as indexesApi from '@/data/api/database/indexes.api';
import * as patternApi from '@/data/api/database/pattern.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedIndex } from '@/__tests__/helpers/mocks/indexes';
import { mockedPattern } from '@/__tests__/helpers/mocks/patterns';
import { CdbError } from '@/data/api/database';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  engine: database.EngineEnum.opensearch,
  capabilities: {
    patterns: {
      create: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
    indexes: {
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

const mockedUsedNavigate = vi.fn();
describe('IndexPatterns page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
      Trans: ({ children }: { children: ReactNode }) => children,
    }));
    vi.mock('@/data/api/database/indexes.api', () => ({
      getIndexes: vi.fn(() => [mockedIndex]),
    }));
    vi.mock('@/data/api/database/pattern.api', () => ({
      getPatterns: vi.fn(() => [mockedPattern]),
    }));
    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: mockedService,
        category: database.engine.CategoryEnum.analysis,
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });
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
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
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
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('patterns-table-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('indexes-table-skeleton')).toBeInTheDocument();
    });
  });
  it('renders and shows patterns table', async () => {
    vi.mocked(patternApi.getPatterns).mockResolvedValue([mockedPattern]);
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedPattern.pattern)).toBeInTheDocument();
    });
  });
  it('renders and shows index table', async () => {
    vi.mocked(indexesApi.getIndexes).mockResolvedValue([mockedIndex]);
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedIndex.name)).toBeInTheDocument();
    });
  });
  it('displays add pattern button if capability is present', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          patterns: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: database.engine.CategoryEnum.analysis,
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('pattern-add-button')).toBeInTheDocument();
  });
  it('does not display add pattern button if capability is absent', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          patterns: {},
        },
      },
      category: database.engine.CategoryEnum.analysis,
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.queryByTestId('pattern-add-button')).not.toBeInTheDocument();
  });
  it('disable add pattern button if capability is disabled', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          patterns: {
            create: database.service.capability.StateEnum.disabled,
          },
        },
      },
      category: database.engine.CategoryEnum.analysis,
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    const addButton = screen.queryByTestId('pattern-add-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });
  it('open add indexes modal on button click', async () => {
    vi.mocked(ServiceContext.useServiceData).mockReturnValueOnce({
      projectId: 'projectId',
      service: {
        ...mockedService,
        capabilities: {
          patterns: {
            create: database.service.capability.StateEnum.enabled,
          },
        },
      },
      category: database.engine.CategoryEnum.analysis,
      serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
    });
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('pattern-add-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add-pattern');
    });
  });
});

describe('Action index table button', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('indexes-action-trigger');
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
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedIndex.name)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open delete index modal', async () => {
    await openButtonInMenu('indexes-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./delete-index/indexId');
    });
  });
});

describe('Action patterns table button', () => {
  // Helper function to open a button in the table menu
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('patterns-action-trigger');
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
    render(<IndexPatterns />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedPattern.pattern)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open delete patterns modal', async () => {
    await openButtonInMenu('patterns-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './delete-pattern/patternId',
      );
    });
  });
});
