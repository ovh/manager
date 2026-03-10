import { useParams } from 'react-router-dom';

import type { Mock } from 'vitest';
import { describe, expect, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { vrackListMocks, vrackServicesListMocks } from '@ovh-ux/manager-network-common';

import { labels } from '@/__tests__/test-i18n';
import { assertDisabled, getElementByText, renderTestComponent } from '@/__tests__/uiTestHelpers';

import SubnetsListing from '../SubnetsListing.page';

describe('SubnetsListing', () => {
  it('should display the subnets listing if subnet exist', async () => {
    // Given
    const mockVs = vrackServicesListMocks[1];
    if (!mockVs) {
      expect.fail('Mock data incomplete');
    }

    (useParams as Mock).mockReturnValue({
      id: mockVs.id,
      vrackId: vrackListMocks[1],
      urn: '',
    });

    const { container } = await renderTestComponent({
      component: <SubnetsListing />,
      nbVs: 2,
    });

    await assertTextVisibility(labels.subnets.subnetDatagridDisplayNameLabel);

    // Creating more than 1 subnet should be disabled
    await assertTextVisibility(labels.subnets.betaSubnetLimitMessage);
    const submitButton = await getElementByText({
      value: labels.subnets.createSubnetButtonLabel,
    });

    if (!submitButton) {
      expect.fail('Submit button not found');
    }

    await assertDisabled(submitButton);
    expect(container).toMatchSnapshot();
  });
});
