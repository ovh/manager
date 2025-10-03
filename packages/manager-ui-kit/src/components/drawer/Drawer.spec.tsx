import userEvent from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { mockedProps } from './DrawerBase.mock';
import { Drawer } from './Drawer.component';

it('should display a backdrop overlay', async () => {
  const user = userEvent.setup();
  render(<Drawer {...mockedProps} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.getByTestId('drawer-backdrop')).toBeVisible();
});

it('should close the drawer on backdrop click', async () => {
  const user = userEvent.setup();
  render(<Drawer {...mockedProps} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();

  const backdrop = screen.getByTestId('drawer-backdrop');
  await act(() => user.click(backdrop));

  expect(mockedProps.onDismiss).toHaveBeenCalled();
});
