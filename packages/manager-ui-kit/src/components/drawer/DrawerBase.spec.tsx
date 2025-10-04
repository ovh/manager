import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedProps } from './DrawerBase.mock';
import { DrawerBase } from './DrawerBase.component';

it('should display the drawer', async () => {
  const { container } = render(<DrawerBase {...mockedProps} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByText('Drawer heading')).not.toBeNull();
  expect(screen.queryByText('Drawer content')).not.toBeNull();

  const dismissButton = screen.getByTestId('drawer-dismiss-button');
  const primaryButton = await getOdsButtonByLabel({
    container,
    label: mockedProps.primaryButtonLabel || '',
  });
  const secondaryButton = await getOdsButtonByLabel({
    container,
    label: mockedProps.secondaryButtonLabel || '',
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

  expect(screen.queryByTestId('drawer-handle')).toBeNull();
});

it('should show a loader when isLoading is true', () => {
  render(<DrawerBase {...mockedProps} isLoading={true} />);
  expect(screen.getByTestId('drawer')).not.toBeNull();
  expect(screen.queryByText('Drawer heading')).toBeNull();
  expect(screen.queryByText('Drawer content')).toBeNull();
  expect(screen.getByTestId('drawer-spinner')).not.toBeNull();
});

it('should close the drawer when the dismiss button is clicked', async () => {
  const user = userEvent.setup();
  render(<DrawerBase {...mockedProps} />);

  expect(screen.getByTestId('drawer')).not.toBeNull();

  const dismissButton = screen.getByTestId('drawer-dismiss-button');
  await act(() => user.click(dismissButton));

  expect(mockedProps.onDismiss).toHaveBeenCalled();
});
