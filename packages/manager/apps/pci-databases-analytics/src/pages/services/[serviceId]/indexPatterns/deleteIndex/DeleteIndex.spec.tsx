import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as database from '@/types/cloud/project/database';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedIndex } from '@/__tests__/helpers/mocks/indexes';
import * as indexesApi from '@/data/api/database/indexes.api';
import DeleteIndexModal from './DeleteIndex.modal';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

// Override mock to add capabilities
const mockedService = {
  ...mockedServiceOrig,
  engine: database.EngineEnum.opensearch,
  capabilities: {
    indexes: {
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
};

describe('DeleteIndex modal', () => {
  beforeEach(async () => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
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
        useParams: () => ({
          projectId: 'projectId',
          indexId: 'indexId',
        }),
      };
    });

    vi.mock('@/data/api/database/indexes.api', () => ({
      getIndexes: vi.fn(() => [mockedIndex]),
      deleteIndex: vi.fn(),
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

  it('renders skeleton while loading', async () => {
    render(<DeleteIndexModal />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
    });
  });

  it('open and close delete delete index modal', async () => {
    render(<DeleteIndexModal />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-indexes-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-indexes-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-indexes-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('display error on delete indexes error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteIndexToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(indexesApi.deleteIndex).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    render(<DeleteIndexModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-indexes-submit-button'));
    });
    await waitFor(() => {
      expect(indexesApi.deleteIndex).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete indexes success', async () => {
    render(<DeleteIndexModal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-indexes-submit-button'));
    });
    await waitFor(() => {
      expect(indexesApi.deleteIndex).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteIndexToastSuccessTitle',
        description: 'deleteIndexToastSuccessDescription',
      });
    });
  });
});
