import { act, screen } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
  mockVrackSegmentList,
} from '@ovh-ux/manager-module-vcd-api';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { renderTest } from '../../../../../test-utils';
import fr_FR from '../../../../../../public/translations/datacentres/vrack-segment/Messages_fr_FR.json';

const checkTitleIsVisible = () =>
  expect(
    screen.queryAllByText(fr_FR.managed_vcd_dashboard_vrack_add_network)[0],
  ).toBeVisible();

const checkFormInputAndCta = (container: HTMLElement) => {
  expect(
    screen.queryAllByText(fr_FR.managed_vcd_dashboard_vrack_add_network)[0],
  ).toBeVisible();
  expect(
    container.querySelector(
      `[label="${fr_FR.managed_vcd_dashboard_vrack_add_network}"]`,
    ),
  ).toBeVisible();
  expect(container.querySelector('[label="cancel"]')).toBeVisible();

  const input = container.querySelector('input[name="network"]');

  expect(input).toBeInTheDocument();
};

const checkNetworkValue = (container: HTMLElement, vlanId: string) => {
  const input = container.querySelector(
    `input[name="network"][value="${vlanId}"]`,
  );

  expect(input).toBeInTheDocument();
};

const submitForm = (container: HTMLElement) => {
  return act(() =>
    userEvent.click(
      container.querySelector(
        `[label="${fr_FR.managed_vcd_dashboard_vrack_add_network}"]`,
      ) as Element,
    ),
  );
};

const checkErrorBannerIsVisible = () => {
  screen.queryByText(
    fr_FR.managed_vcd_dashboard_vrack_add_network_error.replace(
      '{{errorApi}}',
      '',
    ),
  );
};

// Check modal is closed and success message is shown
describe('Edit Vrack Segment Id Page', () => {
  it('The form is displayed and can be submitted', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/add-network`,
    });

    await waitFor(
      () => {
        checkTitleIsVisible();
      },
      { timeout: 3_000 },
    );

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkNetworkValue(container, '');
      },
      { timeout: 2000 },
    );

    await submitForm(container);
  });

  it('The form is displayed and can be submitted and we show error', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/add-network`,
      isVrackSegmentUpdateKo: true,
    });

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
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/add-network`,
      isVrackSegmentKO: true,
    });

    await waitFor(() => {
      checkTitleIsVisible();
    });

    await waitFor(() => expect(screen.getByText('Oops …!')).toBeVisible(), {
      timeout: 2000,
    });
  });
});
