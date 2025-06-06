import { vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer, DrawerProps } from './Drawer.component';

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

export const mockedProps: DrawerProps = {
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

it('should display the drawer in its classic variant', () => {
  render(<Drawer {...mockedProps} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByText('Drawer heading')).not.toBeNull();
  expect(screen.queryByText('Drawer content')).not.toBeNull();

  const dismissButton = screen.getByTestId('drawer-dismiss-button');
  const primaryButton = screen.getByTestId('drawer-primary-button');
  const secondaryButton = screen.getByTestId('drawer-secondary-button');

  expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss');

  expect(primaryButton).toHaveAttribute('label', 'Confirm');
  expect(primaryButton).toHaveAttribute('color', 'primary');
  expect(primaryButton).toHaveAttribute('variant', 'default');
  expect(primaryButton).toHaveAttribute('is-loading', 'false');
  expect(primaryButton).toHaveAttribute('is-disabled', 'false');

  expect(secondaryButton).toHaveAttribute('label', 'Cancel');
  expect(secondaryButton).toHaveAttribute('color', 'primary');
  expect(secondaryButton).toHaveAttribute('variant', 'ghost');
  expect(secondaryButton).toHaveAttribute('is-loading', 'false');
  expect(secondaryButton).toHaveAttribute('is-disabled', 'false');

  expect(screen.queryByTestId('drawer-backdrop')).not.toBeNull();
  expect(screen.queryByTestId('drawer-handle')).toBeNull();
});

it('should show a loader when isLoading is true', () => {
  render(<Drawer {...mockedProps} isLoading={true} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByText('Drawer heading')).toBeNull();
  expect(screen.queryByText('Drawer content')).toBeNull();
  expect(screen.getByTestId('drawer-spinner')).not.toBeNull();
});

it('should close the drawer when the dismiss button is clicked', async () => {
  const user = userEvent.setup();
  render(<Drawer {...mockedProps} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();

  const dismissButton = screen.getByTestId('drawer-dismiss-button');
  await act(() => user.click(dismissButton));

  expect(mockedProps.onDismiss).toHaveBeenCalled();
});

it('should close the drawer when the backdrop is clicked', async () => {
  const user = userEvent.setup();
  render(<Drawer {...mockedProps} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();

  const backdrop = screen.getByTestId('drawer-backdrop');
  await act(() => user.click(backdrop));

  expect(mockedProps.onDismiss).toHaveBeenCalled();
});

it('should display the drawer in its collapsible variant', () => {
  render(<Drawer {...mockedProps} variant="collapsible" />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByTestId('drawer-backdrop')).toBeNull();
  expect(screen.queryByTestId('drawer-handle')).not.toBeNull();
});

it('should collapse and reopen the drawer when the handle is clicked', async () => {
  const user = userEvent.setup();

  render(<Drawer {...mockedProps} variant="collapsible" />);
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
