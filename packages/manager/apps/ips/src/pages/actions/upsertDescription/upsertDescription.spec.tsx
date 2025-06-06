import { describe, it, vi } from 'vitest';
import {
  assertOdsModalVisibility,
  getButtonByTestId,
} from '@ovh-ux/manager-core-test-utils';
// import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
// import { UseMutationResult } from '@tanstack/react-query';
import {
  getButtonByIcon,
  labels,
  renderTest,
  getButtonByLabel,
  // changeTextareaValue,
} from '@/test-utils';

import { urls } from '@/routes/routes.constant';

// Mock the hooks
// const mockUseUpsertIpDescription = vi.fn();
// vi.mock('@/data/hooks/ip/useUpsertIpDescription', () => ({
//   useUpsertIpDescription: () => mockUseUpsertIpDescription(),
// }));

describe('Ip Upsert Description test suite', () => {
  it('should display and close the Ip Upsert Description modal', async () => {
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

    // edit description button
    const editDescriptionButton = await getButtonByLabel({
      container,
      label: labels.listing.listingActionEditDescription,
    });
    await waitFor(() => fireEvent.click(editDescriptionButton));

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
  /*
  it('should display and perform the upsert of the Ip Upsert Description modal', async () => {
    const onSuccessMock = vi.fn();
    const mutateAsyncMock = vi.fn().mockImplementation(() => {
      onSuccessMock();
      return Promise.resolve();
    });

    mockUseUpsertIpDescription.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      isError: false,
      isSuccess: true,
      data: undefined as ApiResponse<void> | undefined,
      variables: undefined as void,
      reset: vi.fn(),
      mutate: vi.fn(),
      isIdle: false,
      status: 'success',
      context: undefined as unknown,
      failureCount: 0,
      failureReason: undefined as ApiError,
      isPaused: false,
      submittedAt: Date.now(),
      error: null,
    } as UseMutationResult<ApiResponse<void>, ApiError, void, unknown>);

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

    // edit description button
    const editDescriptionButton = await getButtonByLabel({
      container,
      label: labels.listing.listingActionEditDescription,
    });
    await waitFor(() => fireEvent.click(editDescriptionButton));

    // Wait for modal to be visible
    await waitFor(() => {
      const modal = container.querySelector('ods-modal');
      expect(modal).toBeInTheDocument();
    });

    // Check if modal is visible
    await assertOdsModalVisibility({ container, isVisible: true });

    // Update the description
    await changeTextareaValue({
      container,
      testId: 'textarea-form-field',
      value: 'new description',
    });

    // Find and click the confirm button
    const confirmButton = await getButtonByTestId({
      testId: 'confirm-button',
    });

    // Click the confirm button and wait for onSuccess
    await waitFor(
      async () => {
        await userEvent.click(confirmButton);
        await waitFor(() => {
          expect(mutateAsyncMock).toHaveBeenCalled();
        });
        const modal = container.querySelector('ods-modal');
        if (modal) {
          throw new Error('Modal is still present after successful upsert');
        }
      },
      { timeout: 5000 },
    );

    // Final check that modal is not visible
    await assertOdsModalVisibility({ container, isVisible: false });
  }); */
});
