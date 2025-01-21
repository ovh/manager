import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Locale } from '@/hooks/useLocale.hook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { mockedDatastoreWithRegion } from '@/__tests__/helpers/mocks/datastore';
import AddDatastore from './AddDatastore.modal';

describe('AddDatastore modal', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectID',
        }),
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
    vi.mock('@/data/api/ai/datastore.api', () => ({
      addDatastore: vi.fn(() => mockedDatastoreWithRegion),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegion]),
    }));

    const mockScrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

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

  it('renders modal skeleton while loading', async () => {
    render(<AddDatastore />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('dialog-container')).toBeInTheDocument();
  });

  it('open and close add datastore modal', async () => {
    render(<AddDatastore />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-datastore-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-datastore-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-datastore-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('renders addDatastore and display toast error', async () => {
    render(<AddDatastore />, { wrapper: RouterWithQueryClientWrapper });
    const errorMsg = {
      description: 'api error message',
      title: 'formDatastoreToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.addDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-datastore-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-access-key-input'), {
        target: {
          value: 'access_key',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-secret-key-input'), {
        target: {
          value: 'secret_key',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-s3-region-input'), {
        target: {
          value: 's3_region',
        },
      });
    });

    // Select region
    const regionTrigger = screen.getByTestId('select-region-trigger');
    await waitFor(() => {
      expect(regionTrigger).toBeInTheDocument();
    });
    act(() => {
      fireEvent.focus(regionTrigger);
      fireEvent.keyDown(regionTrigger, { key: 'Enter', code: 13 });
    });
    await waitFor(() => {
      expect(regionTrigger).not.toHaveAttribute('data-state', 'closed');
      act(() => {
        const optionsElements = screen.getAllByRole('option');
        const elem = optionsElements.find((e) => e.innerHTML.includes('GRA'));
        fireEvent.keyDown(elem, { key: 'Enter', code: 13 });
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addToken and refresh getRegistries after added', async () => {
    render(<AddDatastore />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('add-datastore-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-alias-input'), {
        target: {
          value: 'alias',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-endpoint-input'), {
        target: {
          value: 'endpoint',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-access-key-input'), {
        target: {
          value: 'access_key',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-secret-key-input'), {
        target: {
          value: 'secret_key',
        },
      });
    });
    act(() => {
      fireEvent.change(screen.getByTestId('datastore-s3-region-input'), {
        target: {
          value: 's3_region',
        },
      });
    });

    // Select region
    const regionTrigger = screen.getByTestId('select-region-trigger');
    await waitFor(() => {
      expect(regionTrigger).toBeInTheDocument();
    });
    act(() => {
      fireEvent.focus(regionTrigger);
      fireEvent.keyDown(regionTrigger, { key: 'Enter', code: 13 });
    });
    await waitFor(() => {
      expect(regionTrigger).not.toHaveAttribute('data-state', 'closed');
      act(() => {
        const optionsElements = screen.getAllByRole('option');
        const elem = optionsElements.find((e) => e.innerHTML.includes('GRA'));
        fireEvent.keyDown(elem, { key: 'Enter', code: 13 });
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('add-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'formDatastoreToastSuccessTitle',
        description: 'formDatastoreToastSuccessDescription',
      });
    });
  });
});
