import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { mockedUsedNavigate, setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import AddDatabase from './AddDatabase.modal';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as databaseApi from '@/data/api/database/database.api';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { useToast } from '@datatr-ux/uxlib';

vi.mock('@/data/api/database/database.api', () => ({
  addDatabase: vi.fn(),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    service: mockedService,
  })),
}));

describe('AddDatabase Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the modal', async () => {
    render(<AddDatabase />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByTestId('add-database-modal')).toBeInTheDocument();
    expect(screen.getByTestId('add-database-name-input')).toBeInTheDocument();
    expect(
      screen.getByTestId('add-database-submit-button'),
    ).toBeInTheDocument();
  });

  it('should show validation error on empty submission', async () => {
    render(<AddDatabase />, { wrapper: RouterWithQueryClientWrapper });

    const submitButton = screen.getByTestId('add-database-submit-button');
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('addDatabaseErrorMinLength')).toBeInTheDocument();
    });
  });

  it('should call addDatabase API on valid form submission', async () => {
    render(<AddDatabase />, { wrapper: RouterWithQueryClientWrapper });

    const nameInput = screen.getByTestId('add-database-name-input');
    const submitButton = screen.getByTestId('add-database-submit-button');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'MyDatabase' } });
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(databaseApi.addDatabase).toHaveBeenCalledWith({
        serviceId: mockedService.id,
        projectId: 'projectId',
        engine: mockedService.engine,
        name: 'MyDatabase',
      });
    });
  });

  it('should show success toast on successful database addition', async () => {
    vi.mocked(databaseApi.addDatabase).mockResolvedValue({
      name: 'MyDatabase',
      default: false,
      id: '',
    });

    render(<AddDatabase />, { wrapper: RouterWithQueryClientWrapper });

    const nameInput = screen.getByTestId('add-database-name-input');
    const submitButton = screen.getByTestId('add-database-submit-button');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'MyDatabase' } });
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addDatabaseToastSuccessTitle',
        description: 'addDatabaseToastSuccessDescription',
      });
    });
  });

  it('should show error toast on failed database addition', async () => {
    vi.mocked(databaseApi.addDatabase).mockRejectedValue(apiErrorMock);

    render(<AddDatabase />, { wrapper: RouterWithQueryClientWrapper });

    const nameInput = screen.getByTestId('add-database-name-input');
    const submitButton = screen.getByTestId('add-database-submit-button');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'MyDatabase' } });
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(databaseApi.addDatabase).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'addDatabaseToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });

  it('should navigate back when the modal is closed', async () => {
    render(<AddDatabase />, { wrapper: RouterWithQueryClientWrapper });

    const cancelButton = screen.getByTestId('add-database-cancel-button');
    act(() => {
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });
});
