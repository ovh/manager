import { vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import '../../__tests__/drawer.mocks';
import { render } from '@/setupTest';
import { DrawerRoot } from '../DrawerRoot.component';
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

describe('DrawerRoot', () => {
  beforeEach(() => {
    mockedHook.mockReturnValue({
      isAuthorized: true,
      isLoading: false,
      isFetched: true,
    });
  });

  it('should display a backdrop overlay', () => {
    render(<DrawerRoot isOpen={true} onDismiss={vi.fn()} />);
    expect(screen.getByTestId('drawer')).not.toBeNull();
    expect(screen.getByTestId('drawer-backdrop')).toBeVisible();
  });

  it('should close the drawer on backdrop click', () => {
    const onDismiss = vi.fn();
    render(<DrawerRoot isOpen={true} onDismiss={onDismiss} />);
    expect(screen.getByTestId('drawer')).not.toBeNull();

    const backdrop = screen.getByTestId('drawer-backdrop');
    fireEvent.click(backdrop);
    expect(onDismiss).toHaveBeenCalled();
  });
});
