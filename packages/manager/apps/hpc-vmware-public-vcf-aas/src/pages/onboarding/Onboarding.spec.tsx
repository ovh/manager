import { vi } from 'vitest';
import {
  assertElementVisibility,
  assertTextVisibility,
  getElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { act, waitFor } from '@testing-library/react';
import { renderTest, labels } from '../../test-utils';
import TEST_IDS from '../../utils/testIds.constants';
import { ORDER_VCD_REDIRECTION_URL } from '../../utils/orderVcdRedirection.constants';
import { VMWARE_CLOUD_DIRECTOR_LABEL } from '../../utils/label.constants';

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
  let windowOpenSpy: any;

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

    await act(async () => {
      orderButton.click();
    });

    await waitFor(() => {
      expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, '_blank');
    });
  });
});
