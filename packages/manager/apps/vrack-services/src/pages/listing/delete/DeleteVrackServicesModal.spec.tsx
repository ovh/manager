import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  assertModalVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent } from '@testing-library/react';

import { urls } from '@/routes/routes.constants';
import {
  assertModalTitle,
  changeInputValueByLabelText,
  getButtonByIcon,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../../test-utils';

describe('Vrack Services delete test suite', () => {
  it('should delete a vrack service', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.listing,
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenuButton));

    const deleteVrackService = await getButtonByLabel({
      container,
      label: labels.common['action-deleteVrackServices'],
    });

    await waitFor(() => fireEvent.click(deleteVrackService));

    await assertModalTitle({
      container,
      title: labels.common.modalDeleteVrackServicesHeadline,
    });
    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });
    await changeInputValueByLabelText({
      inputLabel: labels.common.modalDeleteVrackServicesInputLabel,
      value: 'TERMINATE',
    });

    const submitButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
  });
});
