import { vi } from 'vitest';
import { getOdsButtonByLabel } from '@ovh-ux/manager-core-test-utils';
import { render, screen } from '@testing-library/react';
import { DrawerFooter } from '../DrawerFooter.component';
import { DrawerFooterProps } from '../DrawerFooter.props';

export const mockedDrawerFooterProps: DrawerFooterProps = {
  primaryButtonLabel: 'Confirm',
  isPrimaryButtonLoading: false,
  isPrimaryButtonDisabled: false,
  onPrimaryButtonClick: vi.fn(),
  secondaryButtonLabel: 'Cancel',
  isSecondaryButtonDisabled: false,
  isSecondaryButtonLoading: false,
  onSecondaryButtonClick: vi.fn(),
};

it('should display the buttons if they are provided', async () => {
  const { container } = render(<DrawerFooter {...mockedDrawerFooterProps} />);

  const primaryButton = await getOdsButtonByLabel({
    container,
    label: mockedDrawerFooterProps.primaryButtonLabel,
  });
  const secondaryButton = await getOdsButtonByLabel({
    container,
    label: mockedDrawerFooterProps.secondaryButtonLabel,
  });

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
});

it('should display only the primary button if only the primary button is provided', async () => {
  const mockedProps = {
    ...mockedDrawerFooterProps,
    secondaryButtonLabel: undefined,
  };
  const { container } = render(<DrawerFooter {...mockedProps} />);

  const primaryButton = await getOdsButtonByLabel({
    container,
    label: mockedDrawerFooterProps.primaryButtonLabel,
  });

  expect(primaryButton).toHaveAttribute('label', 'Confirm');
  expect(primaryButton).toHaveAttribute('color', 'primary');

  expect(
    screen.queryByText(mockedDrawerFooterProps.secondaryButtonLabel),
  ).toBeNull();
});

it('should display only the secondary button if only the secondary button is provided', async () => {
  const mockedProps = {
    ...mockedDrawerFooterProps,
    primaryButtonLabel: undefined,
  };
  const { container } = render(<DrawerFooter {...mockedProps} />);

  const secondaryButton = await getOdsButtonByLabel({
    container,
    label: mockedDrawerFooterProps.secondaryButtonLabel,
  });

  expect(secondaryButton).toHaveAttribute('label', 'Cancel');
  expect(secondaryButton).toHaveAttribute('color', 'primary');
});
