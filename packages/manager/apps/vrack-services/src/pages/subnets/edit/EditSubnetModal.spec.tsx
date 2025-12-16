import { describe, it, Mock } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  vrackListMocks,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  labels,
  assertDisabled,
  assertEnabled,
  doActionOnElementUntil,
  renderTestComponent,
  changeInputValueByTestId,
} from '@/test-utils';
import EditSubnetModal from './EditSubnetModal.page';

describe('EditSubnetModal', () => {
  it('should display a subnet editing modal', async () => {
    (useParams as Mock).mockReturnValue({
      id: vrackServicesListMocks[1].id,
      vrackId: vrackListMocks[1],
      cidr: vrackServicesListMocks[1].currentState.subnets[0].cidr,
      urn: '',
    });

    await renderTestComponent({
      component: <EditSubnetModal />,
      nbVs: 2,
    });

    await assertTextVisibility(labels.subnets.modalSubnetUpdateHeadline);

    const displayNameInputField = await screen.findByTestId(
      'display-name-input',
    );
    const cidrInputField = await screen.findByTestId('cidr-input');
    const serviceRangeInputField = await screen.findByTestId('service-range');
    const vlanOptionInputField = await screen.findByTestId('vlan-option');
    await assertEnabled(displayNameInputField);
    await assertEnabled(cidrInputField);
    await assertEnabled(serviceRangeInputField);
    await assertEnabled(vlanOptionInputField);

    const modifyButton = (await screen.findAllByRole('button')).at(2);
    await assertDisabled(modifyButton);

    await changeInputValueByTestId({
      testId: 'display-name-input',
      value: 'My.other-subnet',
    });

    await assertEnabled(modifyButton);

    await changeInputValueByTestId({
      testId: 'cidr-input',
      value: '10.0.0.0/23',
    });

    // should be invalid cidr
    await assertDisabled(modifyButton);

    await changeInputValueByTestId({
      testId: 'cidr-input',
      value: '10.0.0.0/24',
    });

    // should be valid cidr again
    await assertEnabled(modifyButton);

    await doActionOnElementUntil(
      () => userEvent.click(modifyButton),
      () => assertDisabled(modifyButton),
    );
  });

  it('should display an error when failing to edit a subnet', async () => {
    (useParams as Mock).mockReturnValue({
      id: vrackServicesListMocks[1].id,
      vrackId: vrackListMocks[1],
      cidr: vrackServicesListMocks[1].currentState.subnets[0].cidr,
      urn: '',
    });

    await renderTestComponent({
      component: <EditSubnetModal />,
      nbVs: 2,
      updateKo: true,
    });

    await assertTextVisibility(labels.subnets.modalSubnetUpdateHeadline);

    const modifyButton = (await screen.findAllByRole('button')).at(2);
    await assertDisabled(modifyButton);

    await changeInputValueByTestId({
      testId: 'display-name-input',
      value: 'My.other-subnet',
    });

    await assertEnabled(modifyButton);

    await doActionOnElementUntil(
      () => userEvent.click(modifyButton),
      () =>
        assertTextVisibility(
          labels.subnets.subnetUpdateError.replace(
            '{{error}}',
            'Update vs error',
          ),
        ),
    );
  });
});
