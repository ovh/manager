import { vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DrawerCollapsible,
  DrawerCollapsibleProps,
} from './DrawerCollapsible.component';

vi.mock('@ovhcloud/ods-components/react', async () => {
  const original = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...original,
    OdsDrawer: vi.fn(({ children, className, ...props }) => (
      <div data-testid={props['data-testid']} className={className}>
        {children}
      </div>
    )),
  };
});

export const mockedProps: DrawerCollapsibleProps = {
  heading: 'Drawer heading',
  isOpen: true,
  children: <div>Drawer content</div>,
  primaryButtonLabel: 'Confirm',
  isPrimaryButtonLoading: false,
  isPrimaryButtonDisabled: false,
  onPrimaryButtonClick: vi.fn(),
  secondaryButtonLabel: 'Cancel',
  isSecondaryButtonDisabled: false,
  isSecondaryButtonLoading: false,
  onSecondaryButtonClick: vi.fn(),
  onDismiss: vi.fn(),
};

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
