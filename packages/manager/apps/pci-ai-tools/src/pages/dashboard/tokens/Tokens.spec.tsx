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
import Tokens, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/tokens/Tokens.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedToken } from '@/__tests__/helpers/mocks/shared/token';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

describe('Tokens page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
    vi.mock('@/data/api/ai/token/token.api', () => ({
      getTokens: vi.fn(() => [mockedToken]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders the breadcrumb component', async () => {
    const translationKey = 'breadcrumb';
    render(<Breadcrumb />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByText(translationKey)).toBeTruthy();
    });
  });
  it('renders and shows skeletons while loading', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('tokens-table-skeleton')).toBeTruthy();
    });
  });
  it('renders and shows buttons in the user page', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-token-button')).toBeTruthy();
  });

  it('trigger useNavigate on create button click', async () => {
    render(<Tokens />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-token-button')).toBeTruthy();
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
      expect(screen.getByText(mockedToken.spec.name)).toBeTruthy();
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
      expect(screen.getByText(mockedToken.spec.name)).toBeTruthy();
    });
    await openButtonInMenu('token-action-trigger', 'token-action-renew-button');
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      `./renew/${mockedToken.id}`,
    );
  });
});
