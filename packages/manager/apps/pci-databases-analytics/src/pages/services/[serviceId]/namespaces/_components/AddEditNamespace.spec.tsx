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
import { mockedNamespaces } from '@/__tests__/helpers/mocks/namespaces';
import AddEditNamespace from './AddEditNamespace.component';
import * as namespacesApi from '@/data/api/database/namespace.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
describe('AddEditNamespace', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('@/data/api/database/namespace.api', () => ({
      getNamespaces: vi.fn(() => [mockedNamespaces]),
      addNamespace: vi.fn((namespace) => namespace),
      editNamespace: vi.fn((namespace) => namespace),
      deleteNamespace: vi.fn(),
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
    render(<AddEditNamespace service={mockedService} namespaces={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('add-edit-namespaces-modal'),
      ).toBeInTheDocument();
    });
  });

  it('should show validation errors for empty required fields', async () => {
    render(<AddEditNamespace service={mockedService} namespaces={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-namespaces-submit-button'));
    });

    await waitFor(() => {
      expect(
        screen.getAllByText('formNamespaceErrorMandatoryField').length,
      ).toBeGreaterThan(0);
    });
  });
  it('should add a namespace on submit', async () => {
    render(<AddEditNamespace service={mockedService} namespaces={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-namespaces-name-input'), {
        target: {
          value: 'newNamespace',
        },
      });
      fireEvent.change(
        screen.getByTestId('add-edit-namespaces-retention-input'),
        {
          target: {
            value: '3D',
          },
        },
      );
      fireEvent.change(
        screen.getByTestId('add-edit-namespaces-resolution-input'),
        {
          target: {
            value: '3D',
          },
        },
      );
      fireEvent.click(screen.getByTestId('add-edit-namespaces-submit-button'));
    });
    await waitFor(() => {
      expect(namespacesApi.addNamespace).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formNamespaceToastSuccessTitle',
        description: 'addNamespaceToastSuccessDescription',
      });
    });
  });

  it('should not submit if namespace name is already used', async () => {
    render(
      <AddEditNamespace
        service={mockedService}
        namespaces={[mockedNamespaces]}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-namespaces-name-input'), {
        target: { value: mockedNamespaces.name },
      });
      fireEvent.click(screen.getByTestId('add-edit-namespaces-submit-button'));
    });

    await waitFor(() => {
      expect(
        screen.getByText('formNamespaceNameErrorDuplicate'),
      ).toBeInTheDocument();
    });
  });

  it('should toggle advanced configuration', async () => {
    render(<AddEditNamespace service={mockedService} namespaces={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    const toggleButton = screen.getByText(
      'formNamespaceButtonAdvancedConfiguration',
    );

    act(() => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('retention.blockDataExpirationDuration'),
      ).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      expect(
        screen.queryByText('retention.blockDataExpirationDuration'),
      ).not.toBeInTheDocument();
    });
  });

  it('should edit a namespace successfully', async () => {
    render(
      <AddEditNamespace
        service={mockedService}
        namespaces={[mockedNamespaces]}
        editedNamespace={mockedNamespaces}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-namespaces-name-input'), {
        target: { value: 'updatedNamespace' },
      });
      fireEvent.click(screen.getByTestId('add-edit-namespaces-submit-button'));
    });

    await waitFor(() => {
      expect(namespacesApi.editNamespace).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'formNamespaceToastSuccessTitle',
        }),
      );
    });
  });

  it('should handle API error when adding a namespace', async () => {
    vi.mocked(namespacesApi.addNamespace).mockRejectedValue(apiErrorMock);

    render(<AddEditNamespace service={mockedService} namespaces={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-namespaces-name-input'), {
        target: { value: 'newNamespace' },
      });
      fireEvent.change(
        screen.getByTestId('add-edit-namespaces-retention-input'),
        {
          target: {
            value: '3D',
          },
        },
      );
      fireEvent.change(
        screen.getByTestId('add-edit-namespaces-resolution-input'),
        {
          target: {
            value: '3D',
          },
        },
      );
      fireEvent.click(screen.getByTestId('add-edit-namespaces-submit-button'));
    });

    await waitFor(() => {
      expect(namespacesApi.addNamespace).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'addNamespaceToastErrorTitle',
        }),
      );
    });
  });

  it('should close the dialog when canceled', async () => {
    render(<AddEditNamespace service={mockedService} namespaces={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-edit-namespaces-cancel-button'));
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('add-edit-namespaces-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render resolution field only for aggregated namespaces', async () => {
    render(<AddEditNamespace service={mockedService} namespaces={[]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.change(screen.getByTestId('add-edit-namespaces-name-input'), {
        target: { value: 'newNamespace' },
      });
      fireEvent.change(
        screen.getByTestId('add-edit-namespaces-retention-input'),
        { target: { value: '3D' } },
      );
    });

    expect(
      screen.queryByTestId('add-edit-namespaces-resolution-input'),
    ).toBeInTheDocument();
  });
});
