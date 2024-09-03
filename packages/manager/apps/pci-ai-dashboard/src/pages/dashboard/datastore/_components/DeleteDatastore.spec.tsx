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
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { apiErrorMock } from '@/__tests__/helpers/mocks/aiError';
import { useToast } from '@/components/ui/use-toast';
import Datastore from '../Datastore.page';
import { mockedDatastoreWithRegion } from '@/__tests__/helpers/mocks/datastore';

describe('DeleteDatastore modal', () => {
  const openButtonInMenu = async (buttonId: string) => {
    act(() => {
      const trigger = screen.getByTestId('datastore-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    const actionButton = screen.getByTestId(buttonId);
    await waitFor(() => {
      expect(actionButton).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(actionButton);
    });
  };

  beforeEach(async () => {
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
      deleteDatastore: vi.fn(),
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
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreWithRegion.alias),
      ).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open and close delete datastore modal', async () => {
    await openButtonInMenu('datastore-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-datastore-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-datastore-cancel-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-datastore-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('display error on delete datastore error', async () => {
    const errorMsg = {
      description: 'api error message',
      title: 'deleteDatastoreToastErrorTitle',
      variant: 'destructive',
    };
    vi.mocked(datastoreApi.deleteDatastore).mockImplementationOnce(() => {
      throw apiErrorMock;
    });
    await openButtonInMenu('datastore-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-datastore-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(errorMsg);
    });
  });

  it('refetch data on delete datastore success', async () => {
    await openButtonInMenu('datastore-action-delete-button');
    await waitFor(() => {
      expect(screen.getByTestId('delete-datastore-modal')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-datastore-submit-button'));
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('delete-datastore-modal'),
      ).not.toBeInTheDocument();
      expect(datastoreApi.deleteDatastore).toHaveBeenCalled();
      expect(datastoreApi.getDatastores).toHaveBeenCalled();
    });
  });
});
