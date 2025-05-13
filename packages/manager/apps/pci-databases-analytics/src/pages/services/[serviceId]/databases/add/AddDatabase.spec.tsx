import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import AddDatabase from './AddDatabase.modal';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as databaseApi from '@/data/api/database/database.api';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

const mockedUsedNavigate = vi.fn();
vi.mock('@/data/api/database/database.api', () => ({
  addDatabase: vi.fn(),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    service: mockedService,
  })),
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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AddDatabase Component', () => {
  const mockToast = useToast();

  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
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
      expect(mockToast.toast).toHaveBeenCalledWith({
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
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'addDatabaseToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
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
