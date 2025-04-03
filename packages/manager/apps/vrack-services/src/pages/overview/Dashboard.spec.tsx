import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import {
  labels,
  renderTest,
  getLinkByLabel,
  getBadgeByLabel,
} from '@/test-utils';

describe('Vrack Services overview page test suite', () => {
  it('should display the general informations of the vs', async () => {
    const { container } = await renderTest({ nbVs: 1 });

    const link = await getLinkByLabel({
      container,
      value: vrackServicesListMocks[0].iam.displayName,
    });
    await waitFor(() => userEvent.click(link));

    await assertTextVisibility(labels.dashboard.overviewTabLabel);
    await assertTextVisibility(labels.dashboard.subnetsTabLabel);
    await assertTextVisibility(labels.dashboard.endpointsTabLabel);
    await assertTextVisibility(labels.dashboard.tileTitle);
    await assertTextVisibility(vrackServicesListMocks[0].currentState.region);
    await getBadgeByLabel({ container, value: labels.dashboard.DRAFT });
    await assertTextVisibility(vrackServicesListMocks[0].iam.displayName);
    await assertTextVisibility('10 mars 2023');
  });

  it('should display the associated vrack of a vs', async () => {
    const { container } = await renderTest({ nbVs: 6 });

    const link = await getLinkByLabel({
      container,
      value: vrackServicesListMocks[5].iam.displayName,
    });
    await waitFor(() => userEvent.click(link));

    const vrackIdLink = await getLinkByLabel({
      container,
      value: vrackServicesListMocks[5].currentState.vrackId,
    });

    expect(vrackIdLink).toBeInTheDocument();
  });
});
