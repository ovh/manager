import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedProps } from './DrawerBase.mock';
import { DrawerCollapsible } from './DrawerCollapsible.component';

it('should display the drawer in its collapsible variant', () => {
  render(<DrawerCollapsible {...mockedProps} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByTestId('drawer-backdrop')).toBeNull();
  expect(screen.queryByTestId('drawer-handle')).not.toBeNull();
});

it('should collapse and reopen the drawer when the handle is clicked', async () => {
  const user = userEvent.setup();

  render(<DrawerCollapsible {...mockedProps} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();

  // Collapse the drawer
  const handle = screen.getByTestId('drawer-handle');
  await act(() => user.click(handle));

  await waitFor(() => {
    const drawer = screen.getByTestId('drawer');
    const classList = Array.from(drawer.classList);
    const hasTranslateX = classList.some((className) =>
      className.includes('translate-x'),
    );
    expect(hasTranslateX).toBe(true);
  });

  // Reopen the drawer
  await act(() => user.click(handle));

  await waitFor(() => {
    const drawer = screen.getByTestId('drawer');
    const classList = Array.from(drawer.classList);
    const hasTranslateX = classList.some((className) =>
      className.includes('translate-x'),
    );
    expect(hasTranslateX).toBe(false);
  });
});

it('should hide the handle immediately after the user presses the “Esc” key', () => {
  render(<DrawerCollapsible {...mockedProps} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  const handle = screen.getByTestId('drawer-handle');
  expect(handle).toBeVisible();
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  });
  waitFor(() => {
    expect(handle).not.toBeVisible();
    expect(screen.queryByTestId('drawer-handle')).toBeNull();
  });
});
