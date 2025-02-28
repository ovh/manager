import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertModalVisibility,
  changeInputValue,
  getButtonByIcon,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import {
  assertModalTitle,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services edit name test suite', () => {
  it('should display the edit name modal', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[0].id),
      nbVs: 1,
    });

    const editButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.PEN,
    });

    await waitFor(() => fireEvent.click(editButton));

    await assertModalVisibility({ container, isVisible: true });
    await assertModalTitle({
      container,
      title: labels.common.modalUpdateVrackServicesHeadline.replace(
        '{{id}}',
        vrackServicesListMocks[0].id,
      ),
    });

    await changeInputValue({ inputLabel: 'update-input', value: 'new name' });

    const modifyButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
    });

    await waitFor(() => userEvent.click(modifyButton));

    await assertModalVisibility({ container, isVisible: false });
  });
});
