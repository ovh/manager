import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
  mockVrackSegmentList,
} from '@ovh-ux/manager-module-vcd-api';
import { labels, renderTest } from '../../../../../test-utils';
import { urls, subRoutes } from '../../../../../routes/routes.constant';
import TEST_IDS from '../../../../../utils/testIds.constants';

const testVrack = mockVrackSegmentList[0];
const initialRoute = urls.vrackSegmentDeleteNetwork
  .replace(subRoutes.dashboard, organizationList[0].id)
  .replace(subRoutes.vdcId, datacentreList[0].id)
  .replace(subRoutes.vrackSegmentId, testVrack.id)
  .replace(
    subRoutes.vrackNetworkId,
    testVrack.targetSpec.networks[0].split('/')[0],
  );

const {
  managed_vcd_dashboard_vrack_network_delete_subnet: title,
  managed_vcd_dashboard_vrack_network_delete_subnet_content1: content,
  managed_vcd_dashboard_vrack_network_delete_subnet_content2: content2,
  managed_vcd_dashboard_vrack_network_delete_subnet_success: success,
  managed_vcd_dashboard_vrack_network_delete_subnet_error: error,
} = labels.datacentresVrackNetwork;

const checkModalContent = () => {
  expect(screen.getByText(title)).toBeVisible();
  expect(screen.getByText(content)).toBeVisible();
  expect(screen.getByText(content2)).toBeVisible();
};

describe('Delete Vrack Network Page', () => {
  it('should delete the network and display a success banner', async () => {
    await renderTest({ initialRoute });

    // check modal content
    await waitFor(() => checkModalContent(), { timeout: 10_000 });

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    expect(submitCta).toBeEnabled();
    await act(() => userEvent.click(submitCta));

    // check modal visibility
    const modal = screen.getByTestId('modal');
    await waitFor(() => expect(modal).not.toBeInTheDocument(), {
      timeout: 10_000,
    });

    // check success banner
    expect(screen.getByText(success)).toBeVisible();
  });

  // TODO : unskip when page is unmocked
  it.skip('should display an error if updateService is KO', async () => {
    const { debug, container } = await renderTest({
      initialRoute,
      isVrackSegmentUpdateKo: true,
    });

    // check modal content
    await waitFor(() => checkModalContent(), { timeout: 10_000 });

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    await waitFor(
      async () => {
        expect(submitCta).toBeEnabled();
        debug(container, Infinity);
        await act(() => userEvent.click(submitCta));
      },
      { timeout: 10_000 },
    );

    // check modal visibility
    await waitFor(() => expect(screen.getByTestId('modal')).toBeVisible(), {
      timeout: 10_000,
    });

    // check error message
    await waitFor(
      () => expect(screen.getByTestId(TEST_IDS.modalDeleteError)).toBeVisible(),
      {
        interval: 10_000,
      },
    );
  });
});
