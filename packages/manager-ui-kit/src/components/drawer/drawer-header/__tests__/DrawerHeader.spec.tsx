import { screen } from '@testing-library/react';
import { render } from '@/setupTest';
import { DrawerHeader } from '../DrawerHeader.component';
import { useAuthorizationIam } from '../../../../hooks/iam';
import { IamAuthorizationResponse } from '../../../../hooks/iam/iam.interface';

vitest.mock('../../../../hooks/iam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

const mockedHook =
  useAuthorizationIam as unknown as jest.Mock<IamAuthorizationResponse>;

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
