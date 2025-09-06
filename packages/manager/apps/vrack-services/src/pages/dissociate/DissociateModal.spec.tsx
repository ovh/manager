import { describe, it } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import {
  assertModalVisibility,
  getButtonByLabel,
  assertModalText,
  getButtonByIcon,
  labels,
  renderTest,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services dissociate vrack test suite', () => {
  it('from dashboard should dissociate vrack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[5].id),
      nbVs: 6,
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });

    await waitFor(() => userEvent.click(actionMenuButton));

    const dissociateLink = await getButtonByLabel({
      container,
      value: labels.common.vrackActionDissociate,
    });

    await waitFor(() => userEvent.click(dissociateLink));

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.dissociate.modalDissociateHeadline,
    });

    await assertModalText({
      container,
      text: labels.dissociate.modalDissociateDescription,
    });

    const dissociateButton = await getButtonByLabel({
      container,
      value: labels.actions.confirm,
    });

    await waitFor(() => userEvent.click(dissociateButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('from dashboard, should not display error if dissociate fails', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewDissociate
        .replace(':id', vrackServicesListMocks[5].id)
        .replace('vrackId', vrackServicesListMocks[5].currentState.vrackId),
      nbVs: 6,
      dissociateKo: true,
    });

    await assertModalVisibility({ container, isVisible: true });

    const dissociateButton = await getButtonByLabel({
      container,
      value: labels.actions.confirm,
    });

    await waitFor(() => userEvent.click(dissociateButton));

    await assertModalVisibility({ container, isVisible: true });

    await assertModalText({
      container,
      text: labels.dissociate.modalDissociateError.replace(
        '{{error}}',
        'Network error',
      ),
    });
  });

  it('from dashboard, display error when get vrack is in error', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewAssociateAnother.replace(
        ':id',
        vrackServicesListMocks[5].id,
      ),
      nbVs: 6,
      getVrackKo: true,
    });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.associate.modalVrackAssociationError.replace(
        '{{error}}',
        'Get vRack KO',
      ),
    });
  });
});
