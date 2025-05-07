import { describe, it } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { urls } from '@/routes/routes.constants';
import {
  assertModalVisibility,
  getButtonByLabel,
  assertModalText,
  changeInputValueByLabelText,
  getButtonByIcon,
  labels,
  renderTest,
  assertDisabled,
  assertEnabled,
} from '@/test-utils';

describe('Vrack Services delete test suite', () => {
  it.skip('should delete a vrack service', async () => {
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
      text: labels.common.modalDeleteVrackServicesHeadline,
    });
    const submitButton = await getButtonByLabel({
      container,
      value: labels.actions.delete,
      nth: 2,
    });
    await assertDisabled(submitButton);

    await changeInputValueByLabelText({
      inputLabel: labels.common.modalDeleteVrackServicesInputLabel,
      value: 'TERMINATE',
    });

    await assertEnabled(submitButton);
    await waitFor(() => userEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
  });
});
