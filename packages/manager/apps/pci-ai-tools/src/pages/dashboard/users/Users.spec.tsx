import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import Users, {
  breadcrumb as Breadcrumb,
} from '@/pages/dashboard/users/Users.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedPublicCloudUser } from '@/__tests__/helpers/mocks/user';

describe('Users page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    vi.mock('@/data/api/user/user.api', () => ({
      getUsers: vi.fn(() => [mockedPublicCloudUser]),
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
  it('renders and shows buttons in the user page', async () => {
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('manage-user-button')).toBeTruthy();
    expect(screen.getByTestId('create-user-button')).toBeTruthy();
  });

  it('trigger useNavigate on create button click', async () => {
    render(<Users />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('create-user-button')).toBeTruthy();
    act(() => {
      fireEvent.click(screen.getByTestId('create-user-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add');
    });
  });
});
