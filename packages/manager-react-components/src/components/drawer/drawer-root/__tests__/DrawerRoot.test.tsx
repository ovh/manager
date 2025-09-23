import '../../drawer.mocks'; // import the mock first
import { vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DrawerRoot } from '../DrawerRoot.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

it('should display a backdrop overlay', async () => {
  const user = userEvent.setup();
  render(<DrawerRoot isOpen={true} onDismiss={vi.fn()} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.getByTestId('drawer-backdrop')).toBeVisible();
});

it('should close the drawer on backdrop click', async () => {
  const user = userEvent.setup();
  const onDismiss = vi.fn();
  render(<DrawerRoot isOpen={true} onDismiss={onDismiss} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();

  const backdrop = screen.getByTestId('drawer-backdrop');
  await act(() => user.click(backdrop));

  expect(onDismiss).toHaveBeenCalled();
});
