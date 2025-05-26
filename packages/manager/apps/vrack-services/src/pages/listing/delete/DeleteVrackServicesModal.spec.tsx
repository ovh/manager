import { describe, it } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { urls } from '@/routes/routes.constants';
import {
  assertModalVisibility,
  getButtonByLabel,
  assertModalText,
  getButtonByIcon,
  labels,
  renderTest,
  assertEnabled,
} from '@/test-utils';

describe('Vrack Services delete test suite', () => {
  it('should delete a vrack service', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.listing,
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(() => userEvent.click(actionMenuButton));

    const deleteVrackService = await getButtonByLabel({
      container,
      value: labels.actions.delete,
    });
    await waitFor(() => userEvent.click(deleteVrackService));

    await assertModalText({
      container,
      text: labels.deleteModal.deleteModalDescription,
    });

    const submitButton = await getButtonByLabel({
      container,
      value: labels.deleteModal.deleteModalDeleteButton,
    });

    await assertEnabled(submitButton);
    await waitFor(() => userEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
  });
});
