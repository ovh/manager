import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Docker, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/docker/Docker.page';
import { Locale } from '@/hooks/useLocale.hook';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedRegistry } from '@/__tests__/helpers/mocks/registry';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';

const mockedUsedNavigate = vi.fn();
describe('Docker page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/ai/registry.api', () => ({
      getRegistries: vi.fn(() => [mockedRegistry]),
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
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockedUsedNavigate,
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
  it('renders and shows skeletons while loading', async () => {
    render(<Docker />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('docker-table-skeleton')).toBeInTheDocument();
    });
  });
  it('renders and shows buttons in the dockers page', async () => {
    render(<Docker />, { wrapper: RouterWithQueryClientWrapper });
    expect(
      screen.getByTestId('managed-private-registries-link'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('create-docker-button')).toBeInTheDocument();
    expect(screen.getByText(mockedRegistry.id)).toBeInTheDocument();
  });

  it('trigger useNavigate on create button click', async () => {
    render(<Docker />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-docker-button')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('create-docker-button'));
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
      const trigger = screen.getByTestId('docker-action-trigger');
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
    render(<Docker />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedRegistry.id)).toBeInTheDocument();
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('open delete docker modal', async () => {
    await openButtonInMenu('docker-action-delete-button');
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./delete/${mockedRegistry.id}`,
      );
    });
  });
});
