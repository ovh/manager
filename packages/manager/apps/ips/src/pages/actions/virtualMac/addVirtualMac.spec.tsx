import { describe, it, vi } from 'vitest';
import {
  assertOdsModalVisibility,
  getButtonByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import {
  getButtonByIcon,
  labels,
  renderTest,
  getButtonByLabel,
} from '@/test-utils';

import { urls } from '@/routes/routes.constant';

describe('Add Virtual Mac Modal test suite', () => {
  it('should display and close the Add Virtual Mac modal', async () => {
    const { container } = await renderTest({
      nbIp: 2,
      initialRoute: urls.listing,
    });

    // action menu button
    const actionMenuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(() => fireEvent.click(actionMenuButton));

    // Add Virtual Mac button
    const addVirtualMacButton = await getButtonByLabel({
      container,
      label: labels.listing.listingActionAddVirtualMac,
    });
    await waitFor(() => fireEvent.click(addVirtualMacButton));

    // Wait for modal to be visible
    await waitFor(() => {
      const modal = container.querySelector('ods-modal');
      expect(modal).toBeInTheDocument();
    });

    // Check if modal is visible
    await assertOdsModalVisibility({ container, isVisible: true });

    // Find and click the cancel button
    const cancelButton = await getButtonByTestId({
      testId: 'cancel-button',
    });

    // Click the cancel button and wait for the modal to close
    await waitFor(
      async () => {
        await userEvent.click(cancelButton);
        const modal = container.querySelector('ods-modal');
        if (modal) {
          throw new Error('Modal is still present after clicking cancel');
        }
      },
      { timeout: 5000 },
    );

    // Final check that modal is not visible
    await assertOdsModalVisibility({ container, isVisible: false });
  });
});
