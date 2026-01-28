import { waitFor } from '@testing-library/dom';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import fr_FR from '../../../../../../public/translations/datacentres/vrack-segment/Messages_fr_FR.json';
import { labels, renderTest } from '../../../../../test-utils';

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
  vrackSegment: SAFE_MOCK_DATA.vrackSegmentStandard,
};
const initialRoute = `/${config.org.id}/virtual-datacenters/${config.vdc.id}/vrack-segments/${config.vrackSegment.id}/add-network`;

const checkTitleIsVisible = () =>
  expect(screen.queryAllByText(fr_FR.managed_vcd_dashboard_vrack_add_network)[0]).toBeVisible();

const checkFormInputAndCta = (container: HTMLElement) => {
  expect(screen.queryAllByText(fr_FR.managed_vcd_dashboard_vrack_add_network)[0]).toBeVisible();
  expect(
    container.querySelector(`[label="${fr_FR.managed_vcd_dashboard_vrack_add_network}"]`),
  ).toBeVisible();
  expect(container.querySelector(`[label=${labels.commun.actions.cancel}]`)).toBeVisible();

  const input = container.querySelector('input[name="network"]');

  expect(input).toBeInTheDocument();
};

const checkNetworkValue = (container: HTMLElement, vlanId: string) => {
  const input = container.querySelector(`input[name="network"][value="${vlanId}"]`);

  expect(input).toBeInTheDocument();
};

const submitForm = (container: HTMLElement | null) => {
  const submitCta = container?.querySelector(
    `[label="${fr_FR.managed_vcd_dashboard_vrack_add_network}"]`,
  );
  if (!submitCta) {
    throw new Error('Submit button not found');
  }
  return act(() => userEvent.click(submitCta));
};

const checkErrorBannerIsVisible = () => {
  screen.queryByText(
    fr_FR.managed_vcd_dashboard_vrack_add_network_error.replace('{{errorApi}}', ''),
  );
};

// Check modal is closed and success message is shown
describe('Edit Vrack Segment Id Page', () => {
  it('The form is displayed and can be submitted', async () => {
    const { container } = await renderTest({ initialRoute });

    await waitFor(
      () => {
        checkTitleIsVisible();
      },
      { timeout: 10_000 },
    );

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkNetworkValue(container, '');
      },
      { timeout: 10_000 },
    );

    await submitForm(container);
  });

  it('The form is displayed and can be submitted and we show error', async () => {
    const { container } = await renderTest({ initialRoute, isVrackSegmentUpdateKo: true });

    await waitFor(() => {
      checkTitleIsVisible();
    });

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkNetworkValue(container, '');
      },
      { timeout: 3000 },
    );

    await submitForm(container);

    await waitFor(
      () => {
        checkTitleIsVisible();
        checkErrorBannerIsVisible();
      },
      { timeout: 2000 },
    );
  });

  // TODO : unskip when page is unmocked
  it.skip('The form is not visible and we see error', async () => {
    await renderTest({ initialRoute, isVrackSegmentKO: true });

    await waitFor(() => {
      checkTitleIsVisible();
    });

    await waitFor(() => expect(screen.getByText('Oops …!')).toBeVisible(), {
      timeout: 2000,
    });
  });
});
