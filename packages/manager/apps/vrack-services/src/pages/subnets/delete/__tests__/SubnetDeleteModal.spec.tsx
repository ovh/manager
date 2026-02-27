import { useParams } from 'react-router-dom';

import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';
import { describe, expect, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { vrackListMocks, vrackServicesListMocks } from '@ovh-ux/manager-network-common';

import { labels } from '@/__tests__/test-i18n';
import { renderTestComponent } from '@/__tests__/uiTestHelpers';

import SubnetDeleteModal from '../SubnetDeleteModal.page';

describe('SubnetDeleteModal', () => {
  it('should display a subnet deleting modal', async () => {
    const mockVs = vrackServicesListMocks[1];
    if (!mockVs?.currentState?.subnets?.[0]) {
      expect.fail('Mock data incomplete');
    }

    (useParams as Mock).mockReturnValue({
      id: mockVs.id,
      vrackId: vrackListMocks[1],
      cidr: mockVs.currentState.subnets[0].cidr,
      urn: '',
    });

    await renderTestComponent({
      component: <SubnetDeleteModal />,
      nbVs: 2,
    });

    await assertTextVisibility(labels.subnets.modalDeleteSubnetHeadline);
    await assertTextVisibility(labels.subnets.modalDeleteSubnetDescription);
    expect(screen.getByText(labels.actions.delete)).toBeVisible();
  });
});
