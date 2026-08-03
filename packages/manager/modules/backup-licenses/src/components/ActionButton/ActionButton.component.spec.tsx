import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import { ActionButton } from './ActionButton.component';

const renderActionButton = (props: Partial<React.ComponentProps<typeof ActionButton>> = {}) =>
  renderWithProviders(
    <ActionButton
      testId="copy-thing"
      icon={ODS_ICON_NAME.fileCopy}
      accessibleName="Copy the Region field"
      onClick={vi.fn()}
      {...props}
    />,
  );

describe('ActionButton', () => {
  it('exposes its accessible name on the focusable control itself', async () => {
    await renderActionButton();

    const button = screen.getByRole('button', { name: 'Copy the Region field' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBe(screen.getByTestId('copy-thing'));
  });

  it('keeps the icon out of the accessibility tree', async () => {
    const { container } = await renderActionButton();

    expect(container.querySelector(`ods-icon[name="${ODS_ICON_NAME.fileCopy}"]`)).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await expect(container).toBeAccessible();
  });

  it('is named by the label it displays, and only described by the rest', async () => {
    const { container } = await renderActionButton({
      accessibleName: 'Show the secret key',
      visibleLabel: 'Show',
    });

    // WCAG 2.1 SC 2.5.3: a speech-input user says what they read, so nothing may override the label.
    const button = screen.getByRole('button', { name: 'Show' });
    expect(button).toHaveAccessibleDescription('Show the secret key');
    expect(screen.getByText('Show the secret key')).toHaveClass('sr-only');
    await expect(container).toBeAccessible();
  });

  it('reports the click to its caller', async () => {
    const onClick = vi.fn();
    await renderActionButton({ onClick });

    await userEvent.click(screen.getByRole('button', { name: 'Copy the Region field' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
