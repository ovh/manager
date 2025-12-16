import { describe, it, Mock } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import {
  vrackListMocks,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  getElementByText,
  labels,
  assertDisabled,
  renderTestComponent,
} from '@/test-utils';
import SubnetsListing from './SubnetsListing.page';

describe('SubnetsListing', () => {
  it('should display the subnets listing if subnet exist', async () => {
    // Given
    (useParams as Mock).mockReturnValue({
      id: vrackServicesListMocks[1].id,
      vrackId: vrackListMocks[1],
      urn: '',
    });

    await renderTestComponent({
      component: <SubnetsListing />,
      nbVs: 2,
    });

    await assertTextVisibility(labels.subnets.subnetDatagridDisplayNameLabel);

    // Creating more than 1 subnet should be disabled
    await assertTextVisibility(labels.subnets.betaSubnetLimitMessage);
    const submitButton = await getElementByText({
      value: labels.subnets.createSubnetButtonLabel,
    });
    await assertDisabled(submitButton);
  });
});
