import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { usePaginatedUsers, usePostS3Secret } from '@/api/hooks/useUser';
import ListingPage from './Listing.page';
import { wrapper } from '@/wrapperRenders';
import { TUser } from '@/api/data/user';

vi.mock('@/api/hooks/useUser', () => {
  return {
    usePaginatedUsers: vi.fn(),
    usePostS3Secret: vi.fn(),
  };
});

describe('ListingPage', () => {
  it('sould display spinner', () => {
    vi.mocked(usePaginatedUsers).mockReturnValue({
      isPending: true,
      paginatedUsers: [],
    } as never);
    vi.mocked(useFeatureAvailability).mockReturnValue({
      isPending: false,
    } as never);
    const { asFragment } = render(<ListingPage />, { wrapper });
    expect(asFragment()).toMatchSnapshot();
  });

  it('sould display datagrid', () => {
    vi.mocked(usePostS3Secret).mockReturnValue({
      postS3Secret: vi.fn(),
    } as never);
    const paginatedUsers = {
      rows: ([
        {
          id: 'id',
          username: 'username',
          description: 'description',
          status: 'status',
          password: 'password',
        },
      ] as unknown) as TUser[],
    };
    vi.mocked(usePaginatedUsers).mockReturnValue({
      isPending: false,
      paginatedUsers,
    } as never);
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: [{ feature: false }],
      isPending: false,
    } as never);
    const { container } = render(<ListingPage />, { wrapper });
    expect(container).toMatchSnapshot();
  });
});
