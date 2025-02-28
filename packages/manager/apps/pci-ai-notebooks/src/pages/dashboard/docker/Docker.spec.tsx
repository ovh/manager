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
import Docker, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/docker/Docker.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedRegistry } from '@/__tests__/helpers/mocks/shared/registry';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

describe('Docker page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
    vi.mock('@/data/api/ai/registry.api', () => ({
      getRegistries: vi.fn(() => [mockedRegistry]),
    }));
    vi.mock('@/data/api/ai/capabilities.api', () => ({
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

  it('open delete docker modal using action table menu', async () => {
    render(<Docker />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(mockedRegistry.id)).toBeInTheDocument();
    });
    await openButtonInMenu(
      'docker-action-trigger',
      'docker-action-delete-button',
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `./delete/${mockedRegistry.id}`,
    );
  });
});
