import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  organizationList,
  datacentreList,
} from '@ovh-ux/manager-module-vcd-api';
import {
  assertElementLabel,
  assertElementVisibility,
  assertTextVisibility,
  WAIT_FOR_DEFAULT_OPTIONS,
  getElementByTestId,
  getNthElementByTestId,
} from '@ovh-ux/manager-core-test-utils';
import { expect, vi } from 'vitest';
import { OdsMessageColor } from '@ovhcloud/ods-components';
import { act } from '@testing-library/react';
import {
  DEFAULT_LISTING_ERROR,
  labels,
  renderTest,
} from '../../../../test-utils';
import { COMPUTE_LABEL } from '../datacentreDashboard.constants';
import { VHOSTS_LABEL } from '../compute/datacentreCompute.constants';
import TEST_IDS from '../../../../utils/testIds.constants';
import { TRACKING } from '../../../../tracking.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackClickMock,
      trackCurrentPage: vi.fn(),
    }),
  };
});

const vdcRoute = `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}`;
const computeRoute = `${vdcRoute}/compute`;

describe('Datacentre Compute Listing Page', () => {
  it('access and display compute listing page without banner info for special offer', async () => {
    const { getByText, queryByText } = await renderTest({
      initialRoute: vdcRoute,
      feature: { 'hpc-vmware-managed-vcd:compute-special-offer-banner': false },
      nbCompute: 2,
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = getByText(COMPUTE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check page title
    await assertTextVisibility(VHOSTS_LABEL);

    // check order CTA
    const orderButton = await getElementByTestId(TEST_IDS.computeOrderCta);
    await assertElementVisibility(orderButton);
    await assertElementLabel({
      element: orderButton,
      label: labels.datacentresCompute.managed_vcd_vdc_compute_order_cta,
    });

    // check datagrid delete CTA
    const deleteButton = await getNthElementByTestId({
      testId: TEST_IDS.cellDeleteCta,
    });
    await assertElementVisibility(deleteButton);
    expect(deleteButton).toHaveAttribute('is-disabled', 'true');

    const tooltip = await getNthElementByTestId({
      testId: TEST_IDS.cellDeleteTooltip,
    });
    expect(tooltip).toHaveTextContent(
      labels.datacentres.managed_vcd_vdc_contact_support,
    );

    await waitFor(() => {
      const banner = queryByText(
        labels.datacentresCompute.managed_vcd_vdc_compute_special_offer,
      );
      expect(banner).not.toBeInTheDocument();
    });
  });

  it('access and display compute listing page with banner info for special offer', async () => {
    const { getByText, getByTestId } = await renderTest({
      initialRoute: vdcRoute,
      feature: { 'hpc-vmware-managed-vcd:compute-special-offer-banner': true },
      nbCompute: 2,
    });

    // access compute tab
    await assertTextVisibility(COMPUTE_LABEL);
    const tab = getByText(COMPUTE_LABEL);
    await waitFor(() => userEvent.click(tab));

    // check banner info for special offer
    await waitFor(() => {
      const banner = getByTestId(TEST_IDS.computeSpecialOfferBanner);
      const expectedColor: OdsMessageColor = 'information';
      expect(banner).toHaveAttribute('color', expectedColor);
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });

  it('should track click on orderButton', async () => {
    const user = userEvent.setup();
    await renderTest({ initialRoute: computeRoute });

    const orderButton = await getElementByTestId(TEST_IDS.computeOrderCta);

    await act(() => user.click(orderButton));
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.compute.addVirtualHost,
    );
  });

  it('display an error', async () => {
    await renderTest({ initialRoute: computeRoute, isComputeKO: true });
    await assertTextVisibility(DEFAULT_LISTING_ERROR);
  });

  it('should disable remove button when status is suspended', async () => {
    const { queryByTestId } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[1].id}/compute`,
      computeResourceId: '6873cbc3-d158-4cdc-8d37-b2d8dded1c45',
    });

    await assertTextVisibility(COMPUTE_LABEL);

    await waitFor(async () => {
      const orderButton = await getElementByTestId(TEST_IDS.computeOrderCta);
      expect(orderButton.getAttribute('is-disabled')).toBe('true');

      const deleteButton = await getElementByTestId(TEST_IDS.cellDeleteCta);
      expect(deleteButton.getAttribute('is-disabled')).toBe('true');

      const tooltip = queryByTestId(TEST_IDS.cellDeleteTooltip);
      expect(tooltip).not.toBeInTheDocument();
    }, WAIT_FOR_DEFAULT_OPTIONS);
  });
});
