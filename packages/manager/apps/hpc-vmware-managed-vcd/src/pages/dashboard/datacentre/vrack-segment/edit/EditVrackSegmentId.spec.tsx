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
    screen.getByText(fr_FR.managed_vcd_dashboard_vrack_network_edit_vlan_title),
  ).toBeVisible();

const checkTitleIsNotVisible = () =>
  expect(
    screen.queryByText(
      fr_FR.managed_vcd_dashboard_vrack_network_edit_vlan_title,
    ),
  ).not.toBeInTheDocument();

const checkFormInputAndCta = (container: HTMLElement) => {
  expect(
    screen.getByText(fr_FR.managed_vcd_dashboard_vrack_network_edit_vlan),
  ).toBeVisible();
  expect(container.querySelector('[label="modify"]')).toBeVisible();
  expect(container.querySelector('[label="cancel"]')).toBeVisible();

  const input = container.querySelector('input[name="vlanId"]');

  expect(input).toBeInTheDocument();
};

const checkVlanValue = (container: HTMLElement, vlanId: string) => {
  const input = container.querySelector(
    `input[name="vlanId"][value="${vlanId}"]`,
  );

  expect(input).toBeInTheDocument();
};

const validForm = (container: HTMLElement) => {
  return act(() =>
    userEvent.click(container.querySelector('[label="modify"]') as Element),
  );
};

const checkSuccessBannerIsVisible = () => {
  screen.getByText(fr_FR.managed_vcd_dashboard_vrack_network_edit_success);
};

const checkErrorBannerIsVisible = () => {
  screen.queryByText(
    fr_FR.managed_vcd_dashboard_vrack_network_edit_error.replace(
      '{{errorApi}}',
      '',
    ),
  );
};

// Check modal is closed and success message is shown
describe('Edit Vrack Segment Id Page', () => {
  it('The form is displayed and can be submitted', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/edit`,
    });

    await waitFor(() => {
      checkTitleIsVisible();
    });

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkVlanValue(container, mockVrackSegmentList[0].targetSpec.vlanId);
      },
      { timeout: 2000 },
    );

    await validForm(container);

    await waitFor(
      () => {
        checkTitleIsNotVisible();
        checkSuccessBannerIsVisible();
      },
      { timeout: 2000 },
    );
  });

  it('The form is displayed and can be submitted and we show error', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/edit`,
      isVrackSegmentUpdateKo: true,
    });

    await waitFor(() => {
      checkTitleIsVisible();
    });

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkVlanValue(container, mockVrackSegmentList[0].targetSpec.vlanId);
      },
      { timeout: 2000 },
    );

    await validForm(container);

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
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/edit`,
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
