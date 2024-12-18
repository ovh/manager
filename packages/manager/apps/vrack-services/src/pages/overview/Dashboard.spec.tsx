import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertTextVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent } from '@testing-library/react';
import { labels, renderTest } from '../../test-utils';
import vrackServicesList from '../../../mocks/vrack-services/get-vrack-services.json';

describe('Vrack Services overview page test suite', () => {
  it('should display the general informations of the vs', async () => {
    const { container } = await renderTest({
      nbVs: 1,
    });

    const vsInList = await getButtonByLabel({
      container,
      label: vrackServicesList[0].iam.displayName,
      isLink: true,
    });

    await waitFor(() => fireEvent.click(vsInList));

    await assertTextVisibility(labels.dashboard.overviewTabLabel);
    await assertTextVisibility(labels.dashboard.subnetsTabLabel);
    await assertTextVisibility(labels.dashboard.endpointsTabLabel);
    await assertTextVisibility(labels.dashboard.tileTitle);
    await assertTextVisibility(vrackServicesList[0].currentState.region);
    await assertTextVisibility(labels.dashboard.DRAFT);
    await assertTextVisibility(vrackServicesList[0].iam.displayName);
    await assertTextVisibility('10 mars 2023');
  });

  it('should display the associated vrack of a vs', async () => {
    const { container } = await renderTest({
      nbVs: 6,
    });

    const vsInList = await getButtonByLabel({
      container,
      label: vrackServicesList[5].iam.displayName,
      isLink: true,
    });

    await waitFor(() => fireEvent.click(vsInList));

    await getButtonByLabel({
      container,
      label: vrackServicesList[5].currentState.vrackId,
      isLink: true,
    });
  });
});
