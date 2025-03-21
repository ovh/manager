import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertModalText,
  assertModalVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  vrackServicesListMocks,
  vrackListMocks,
} from '@ovh-ux/manager-network-common';
import {
  assertModalTitle,
  changeOdsSelectValueByTestId,
  getButtonByIcon,
  labels,
  renderTest,
} from '../../test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services associate another vrack test suite', () => {
  it('from dashboard should associate another vrack using vrack modal', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[5].id),
      nbVs: 6,
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenuButton));

    const associateAnotherLink = await getButtonByLabel({
      container,
      label: labels.common.vrackActionAssociateToAnother,
    });

    await waitFor(() => fireEvent.click(associateAnotherLink));

    await assertModalVisibility({ container, isVisible: true });
    await assertModalTitle({
      container,
      title: labels.associate.modalAssociateAnotherVrackTitle,
    });

    await assertModalText({
      container,
      text: labels.associate.modalAssociateAnotherVrackDescription,
    });
    await assertModalText({
      container,
      text: vrackServicesListMocks[5].currentState.vrackId,
    });
    await changeOdsSelectValueByTestId({
      testId: 'select-another-vrack',
      value: vrackListMocks[1],
    });

    const associateButton = await getButtonByLabel({
      container,
      label: labels.associate.modalConfirmVrackAssociationButtonLabel,
    });

    await waitFor(() => userEvent.click(associateButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('from dashboard, should propose user to create vrack if no eligible vrack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.overviewAssociateAnother.replace(
        ':id',
        vrackServicesListMocks[5].id,
      ),
      nbVs: 6,
      nbVrack: 0,
    });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: 'modalVrackCreationDescriptionLine1',
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
