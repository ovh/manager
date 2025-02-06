import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Tokens, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/tokens/Tokens.page';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedToken } from '@/__tests__/helpers/mocks/token';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

const mockedUsedNavigate = vi.fn();
describe('Tokens page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/ai/token.api', () => ({
      getTokens: vi.fn(() => [mockedToken]),
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
  it('renders and shows skeletons while loading', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('tokens-table-skeleton')).toBeInTheDocument();
    });
  });
  it('renders and shows buttons in the user page', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-token-button')).toBeInTheDocument();
  });

  it('trigger useNavigate on create button click', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-token-button')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('create-token-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });
  it('open delete token modal', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedToken.spec.name)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'token-action-trigger',
      'token-action-delete-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `./delete/${mockedToken.id}`,
    );
  });
  it('open renew token modal', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedToken.spec.name)).toBeInTheDocument();
    });
    await openButtonInMenu('token-action-trigger', 'token-action-renew-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `./renew/${mockedToken.id}`,
    );
  });
});
