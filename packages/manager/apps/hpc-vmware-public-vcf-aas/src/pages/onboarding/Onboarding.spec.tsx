import { act, waitFor } from '@testing-library/react';
import { MockInstance, vi } from 'vitest';

import {
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';

import { labels, renderTest } from '../../test-utils';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '../../utils/label.constants';
import { ORDER_VCD_REDIRECTION_URL } from '../../utils/orderVcdRedirection.constants';
import TEST_IDS from '../../utils/testIds.constants';

describe('Onboarding Page', () => {
  it('display the onboarding page if there is no VCD Organization', async () => {
    await renderTest({ nbOrganization: 0 });
    await assertTextVisibility(
      labels.onboarding.managed_vcd_onboarding_description_part1.replace(
        '{{productName}}',
        VMWARE_CLOUD_DIRECTOR_LABEL,
      ),
    );
  });
});

describe('VCD Order CTA redirection', () => {
  let windowOpenSpy: MockInstance;

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('is visible and redirects to the correct URL when clicked', async () => {
    await renderTest({ nbOrganization: 1 });

    const orderButton = await getElementByTestId(TEST_IDS.vcdOrderCta);
    await assertElementVisibility(orderButton);

    const expectedUrl = ORDER_VCD_REDIRECTION_URL.FR;

    act(() => {
      orderButton.click();
    });

    await waitFor(() => {
      expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, '_blank');
    });
  });
});
