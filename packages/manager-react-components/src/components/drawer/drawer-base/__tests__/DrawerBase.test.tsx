import '../../drawer.mocks'; // import the mock first
import { vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DrawerBase } from '../DrawerBase.component';
import { DrawerBaseProps } from '../DrawerBase.props';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

export const mockedDrawerBaseProps: DrawerBaseProps = {
  isOpen: true,
  children: <div>Drawer content</div>,
  isLoading: false,
  onDismiss: vi.fn(),
};

it('should display the drawer', async () => {
  render(<DrawerBase {...mockedDrawerBaseProps} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();

  const dismissButton = screen.getByTestId('drawer-dismiss-button');
  expect(dismissButton).toHaveAttribute('aria-label', 'close');
});

it('should show a loader with the dismiss button when isLoading is true', () => {
  render(<DrawerBase {...mockedDrawerBaseProps} isLoading={true} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.getByTestId('drawer-spinner')).not.toBeNull();
  expect(screen.getByTestId('drawer-dismiss-button')).not.toBeNull();
});

it('should show the content when isLoading is false', () => {
  render(
    <DrawerBase {...mockedDrawerBaseProps}>
      <div>Drawer content</div>
    </DrawerBase>,
  );

  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByTestId('drawer-spinner')).toBeNull();
  expect(screen.queryByText('Drawer content')).not.toBeNull();
  expect(screen.getByTestId('drawer-dismiss-button')).not.toBeNull();
});

it('should close the drawer when the dismiss button is clicked', async () => {
  const user = userEvent.setup();
  render(<DrawerBase {...mockedDrawerBaseProps} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();

  const dismissButton = screen.getByTestId('drawer-dismiss-button');
  await act(() => user.click(dismissButton));

  expect(mockedDrawerBaseProps.onDismiss).toHaveBeenCalled();
});
