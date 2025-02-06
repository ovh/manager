import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Git, { breadcrumb as Breadcrumb } from '@/pages/dashboard/git/Git.page';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/region';
import { mockedGitWithRegion } from '@/__tests__/helpers/mocks/datastore';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

const mockedUsedNavigate = vi.fn();
describe('Git page', () => {
  beforeEach(() => {
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/ai/datastore.api', () => ({
      getDatastores: vi.fn(() => [mockedGitWithRegion]),
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
  it('renders and shows buttons in the git page', async () => {
    render(<Git />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-git-button')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(mockedGitWithRegion.alias)).toBeInTheDocument();
    });
  });
  it('trigger useNavigate on create button click', async () => {
    render(<Git />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-git-button')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('create-git-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });
  it('open delete git modal using action table menu', async () => {
    render(<Git />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedGitWithRegion.alias)).toBeInTheDocument();
    });
    await openButtonInMenu('git-action-trigger', 'git-action-delete-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `./delete/${mockedGitWithRegion.region}/${mockedGitWithRegion.alias}`,
    );
  });
});
