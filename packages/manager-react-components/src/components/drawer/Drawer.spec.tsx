import { vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
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

it('should display the drawer', async () => {
  const { container } = render(<Drawer {...mockedProps} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByText('Drawer heading')).not.toBeNull();
  expect(screen.queryByText('Drawer content')).not.toBeNull();

  const dismissButton = screen.getByTestId('drawer-dismiss-button');
  const primaryButton = await getOdsButtonByLabel({
    container,
    label: mockedProps.primaryButtonLabel,
  });
  const secondaryButton = await getOdsButtonByLabel({
    container,
    label: mockedProps.secondaryButtonLabel,
  });

  expect(dismissButton).toHaveAttribute('aria-label', 'close');

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
