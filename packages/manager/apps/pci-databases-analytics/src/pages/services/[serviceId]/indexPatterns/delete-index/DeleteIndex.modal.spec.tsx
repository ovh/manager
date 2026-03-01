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
import { Locale } from '@/hooks/useLocale.hook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as database from '@/types/cloud/project/database';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { mockedIndex } from '@/__tests__/helpers/mocks/indexes';
import * as indexesApi from '@/data/api/database/indexes.api';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
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

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: database.engine.CategoryEnum.analysis,
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

vi.mock('@/data/api/database/indexes.api', () => ({
  getIndexes: vi.fn(() => [mockedIndex]),
  deleteIndex: vi.fn(),
}));

describe('DeleteIndex modal', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      indexId: 'indexId',
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
      variant: 'critical',
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
