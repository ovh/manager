import { describe, vi } from 'vitest';
import { render } from '@testing-library/react';
import AddUserPage from './AddUser.page';
import { wrapper } from '@/wrapperRenders';
import { useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';

vi.mock('@/api/hooks/useUser', () => {
  return {
    useUsers: vi.fn(),
  };
});

describe('AddUserPage', () => {
  it('should display spinner', () => {
    vi.mocked(useUsers).mockReturnValue({
      isPending: true,
    } as never);
    const { asFragment } = render(<AddUserPage />, { wrapper });
    expect(asFragment()).toMatchSnapshot();
  });
  it('should display form', () => {
    vi.mocked(useUsers).mockReturnValue({
      validUsersWithCredentials: ([
        {
          id: 'id',
          username: 'username',
          description: 'description',
          status: 'status',
          password: 'password',
        },
      ] as unknown) as TUser[],
      isPending: false,
    } as never);
    const { asFragment } = render(<AddUserPage />, { wrapper });
    expect(asFragment()).toMatchSnapshot();
  });
});
