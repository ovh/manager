import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedConnectionPool } from '@/__tests__/helpers/mocks/connectionPool';
import AddEditPool from './AddEditPool.component';
import * as connectionPoolsApi from '@/data/api/database/connectionPool.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { GenericUser } from '@/data/api/database/user.api';

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
describe('AddEditPool', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/data/api/database/connectionPool.api', () => ({
      getConnectionPools: vi.fn(() => [mockedConnectionPool]),
      addConnectionPool: vi.fn((pool) => pool),
      editConnectionPool: vi.fn((pool) => pool),
      deleteConnectionPool: vi.fn(),
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form', async () => {
    render(
      <AddEditPool
        service={mockedService}
        connectionPools={[]}
        databases={[mockedDatabase]}
        users={[(mockedUser as unknown) as GenericUser]}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId('add-edit-pools-modal')).toBeInTheDocument();
    });
  });

  it('should show validation errors for empty required fields', async () => {
    render(
      <AddEditPool
        service={mockedService}
        connectionPools={[]}
        databases={[mockedDatabase]}
        users={[(mockedUser as unknown) as GenericUser]}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-pools-submit-button'));
    });

    await waitFor(() => {
      expect(
        screen.getAllByText('formConnectionPoolErrorMinLength').length,
      ).toBeGreaterThan(0);
    });
  });
  it('should add a pool on submit', async () => {
    render(
      <AddEditPool
        service={mockedService}
        connectionPools={[]}
        databases={[mockedDatabase]}
        users={[(mockedUser as unknown) as GenericUser]}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-pools-name-input'), {
        target: {
          value: 'newPool',
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-pools-submit-button'));
    });
    await waitFor(() => {
      expect(connectionPoolsApi.addConnectionPool).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formConnectionPoolToastSuccessTitle',
        description: 'addConnectionPoolToastSuccessDescription',
      });
    });
  });

  it('should not submit if pool name is already used', async () => {
    render(
      <AddEditPool
        service={mockedService}
        connectionPools={[mockedConnectionPool]}
        databases={[mockedDatabase]}
        users={[(mockedUser as unknown) as GenericUser]}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-pools-name-input'), {
        target: {
          value: mockedConnectionPool.name,
        },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-pools-submit-button'));
    });

    await waitFor(() => {
      expect(
        screen.getByText('formConnectionPoolNameErrorDuplicate'),
      ).toBeInTheDocument();
    });
  });

  it('should edit a pool successfully', async () => {
    render(
      <AddEditPool
        service={mockedService}
        connectionPools={[mockedConnectionPool]}
        databases={[mockedDatabase]}
        users={[(mockedUser as unknown) as GenericUser]}
        editedConnectionPool={mockedConnectionPool}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-pools-name-input'), {
        target: { value: 'updatedPool' },
      });
      fireEvent.click(screen.getByTestId('add-edit-pools-submit-button'));
    });

    await waitFor(() => {
      expect(connectionPoolsApi.editConnectionPool).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'formConnectionPoolToastSuccessTitle',
        }),
      );
    });
  });

  it('should handle API error when adding a pool', async () => {
    vi.mocked(connectionPoolsApi.addConnectionPool).mockRejectedValue(
      apiErrorMock,
    );

    render(
      <AddEditPool
        service={mockedService}
        connectionPools={[mockedConnectionPool]}
        databases={[mockedDatabase]}
        users={[(mockedUser as unknown) as GenericUser]}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-pools-name-input'), {
        target: { value: 'newPool' },
      });
      fireEvent.click(screen.getByTestId('add-edit-pools-submit-button'));
    });

    await waitFor(() => {
      expect(connectionPoolsApi.addConnectionPool).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'addConnectionPoolToastErrorTitle',
        }),
      );
    });
  });

  it('should close the dialog when canceled', async () => {
    render(
      <AddEditPool
        service={mockedService}
        connectionPools={[mockedConnectionPool]}
        databases={[mockedDatabase]}
        users={[(mockedUser as unknown) as GenericUser]}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-pools-cancel-button'));
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-pools-modal'),
      ).not.toBeInTheDocument();
    });
  });
});
