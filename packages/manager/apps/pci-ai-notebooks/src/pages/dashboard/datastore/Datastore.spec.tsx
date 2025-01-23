import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Datastore, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/datastore/Datastore.page';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/region';
import { mockedDatastoreWithRegion } from '@/__tests__/helpers/mocks/datastore';

const mockedUsedNavigate = vi.fn();
describe('Datastore page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [mockedDatastoreWithRegion]),
    }));
    vi.mock('@/data/api/ai/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
      };
    });
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
  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeInTheDocument();
    });
  });
  it('renders and shows buttons in the datastore page', async () => {
    render(<Datastore />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-datastore-button')).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText(mockedDatastoreWithRegion.alias),
      ).toBeInTheDocument();
    });
  });

  it('trigger useNavigate on create button click', async () => {
    render(<Datastore />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-datastore-button')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('create-datastore-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });
});

describe('Action table button', () => {
  // Helper function to open a button in the table menu
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

  it('open delete datastore modal', async () => {
    await openButtonInMenu('datastore-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./delete/${mockedDatastoreWithRegion.region}/${mockedDatastoreWithRegion.alias}`,
      );
    });
  });
});
