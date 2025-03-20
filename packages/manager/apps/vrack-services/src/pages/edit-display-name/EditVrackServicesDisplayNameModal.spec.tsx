import { describe, it } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import {
  assertModalVisibility,
  changeInputValueByLabelText,
  getButtonByLabel,
  assertModalText,
  labels,
  renderTest,
  getButtonByIcon,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services edit name test suite', () => {
  it('should display the edit name modal', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[0].id),
      nbVs: 1,
    });

    const editButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.pen,
    });

    await waitFor(() => userEvent.click(editButton));

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.common.modalUpdateVrackServicesHeadline.replace(
        '{{id}}',
        vrackServicesListMocks[0].id,
      ),
    });

    await changeInputValueByLabelText({
      inputLabel: labels.common.updateVrackServicesDisplayNameInputLabel,
      value: 'new name',
    });

    const modifyButton = await getButtonByLabel({
      container,
      value: labels.actions.confirm,
    });
    await waitFor(
      () => expect(modifyButton).not.toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    await waitFor(() => userEvent.click(modifyButton));
    await assertModalVisibility({ container, isVisible: false });
  });
});
