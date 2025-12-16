import { describe, it, Mock } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import {
  vrackListMocks,
  vrackServicesListMocks,
} from '@ovh-ux/manager-network-common';
import React from 'react';
import { useParams } from 'react-router-dom';
import { labels, renderTestComponent } from '@/test-utils';
import SubnetDeleteModal from './SubnetDeleteModal.page';

describe('SubnetDeleteModal', () => {
  it('should display a subnet deleting modal', async () => {
    (useParams as Mock).mockReturnValue({
      id: vrackServicesListMocks[1].id,
      vrackId: vrackListMocks[1],
      cidr: vrackServicesListMocks[1].currentState.subnets[0].cidr,
      urn: '',
    });

    await renderTestComponent({
      component: <SubnetDeleteModal />,
      nbVs: 2,
    });

    await assertTextVisibility(labels.subnets.modalDeleteSubnetHeadline);
  });
});
