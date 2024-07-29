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
import Datastore from '../Datastore.page';

describe('AddDatastore modal', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/components/ui/use-toast', () => {
      const toastMock = vi.fn();
      return {
        useToast: vi.fn(() => ({
          toast: toastMock,
        })),
      };
    });
    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [mockedDatastoreWithRegion]),
      addDatastore: vi.fn(() => mockedDatastoreWithRegion),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegion]),
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
    render(<Datastore />, { wrapper: RouterWithQueryClientWrapper });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close add datastore modal', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-datastore-button'));
    });
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
    const errorMsg = {
      description: 'api error message',
      title: 'formDatastoreToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.addDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    act(() => {
      fireEvent.click(screen.getByTestId('create-datastore-button'));
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
    act(() => {
      fireEvent.click(screen.getByTestId('add-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('renders addToken and refresh getRegistries after added', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('create-datastore-button'));
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
    act(() => {
      fireEvent.click(screen.getByTestId('add-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('add-datastore-modal'),
      ).not.toBeInTheDocument();
      expect(datastoreApi.addDatastore).toHaveBeenCalled();
      expect(datastoreApi.getDatastores).toHaveBeenCalled();
    });
  });
});
