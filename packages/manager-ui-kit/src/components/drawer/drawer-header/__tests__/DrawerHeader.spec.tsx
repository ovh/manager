import { screen } from '@testing-library/react';

import { render } from '@/commons/tests-utils/Render.utils';
import { IamAuthorizationResponse, useAuthorizationIam } from '@/hooks';

import { DrawerHeader } from '../DrawerHeader.component';

vitest.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook = useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

describe('DrawerHeader', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });
  it('should display the title', () => {
    render(<DrawerHeader title="Drawer header title" />);
    const title = screen.getByText('Drawer header title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Drawer header title');
  });
});
