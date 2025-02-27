import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/region';
import { mockedDatastoreWithRegion } from '@/__tests__/helpers/mocks/datastore';
import AddDatastore from './AddDatastore.modal';
import { handleSelectOption } from '@/__tests__/helpers/unitTestHelper';

describe('AddDatastore modal', () => {
  beforeEach(() => {
    vi.mock('@/data/api/ai/datastore.api', () => ({
      addDatastore: vi.fn(() => mockedDatastoreWithRegion),
    }));

    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
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

    // select region
    await handleSelectOption('select-region-trigger', 'GRA');

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

    // select region
    await handleSelectOption('select-region-trigger', 'GRA');

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
