import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import Git, { breadcrumb as Breadcrumb } from '@/pages/dashboard/git/Git.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { mockedGitWithRegion } from '@/__tests__/helpers/mocks/volume/datastore';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

describe('Git page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
    vi.mock('@/data/api/ai/data/datastore.api', () => ({
      getDatastores: vi.fn(() => [mockedGitWithRegion]),
    }));
    vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
      getRegions: vi.fn(() => [mockedCapabilitiesRegionGRA]),
    }));
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
