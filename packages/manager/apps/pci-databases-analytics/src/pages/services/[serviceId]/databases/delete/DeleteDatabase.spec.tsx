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
import * as databaseApi from '@/data/api/database/database.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import DeleteDatabase from './DeleteDatabase.modal';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

vi.mock('@/data/api/database/database.api', () => ({
  getServiceDatabases: vi.fn(() => [mockedDatabase]),
  addDatabase: vi.fn(),
  deleteDatabase: vi.fn(),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
    category: 'operational',
    serviceQuery: {} as UseQueryResult<database.Service, Error>,
  })),
}));

describe('Delete database modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
      category: database.engine.CategoryEnum.all,
      databaseId: mockedDatabase.id,
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should open the modal', async () => {
    render(<DeleteDatabase />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-database-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('delete-database-submit-button'),
      ).toBeInTheDocument();
    });
  });
  it('should delete a database on submit', async () => {
    render(<DeleteDatabase />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-database-submit-button'));
    });
    await waitFor(() => {
      expect(databaseApi.deleteDatabase).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteDatabaseToastSuccessTitle',
        description: 'deleteDatabaseToastSuccessDescription',
      });
    });
  });
  it('should call onError when api failed', async () => {
    vi.mocked(databaseApi.deleteDatabase).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteDatabase />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-database-submit-button'));
    });
    await waitFor(() => {
      expect(databaseApi.deleteDatabase).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteDatabaseToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
});
