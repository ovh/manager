import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { act, screen, waitFor } from '@testing-library/react';
import {
  organizationList,
  datacentreList,
  mockVrackSegmentList,
} from '@ovh-ux/manager-module-vcd-api';
import { labels, renderTest } from '../../../../../test-utils';
import { encodeVrackNetwork } from '../../../../../utils/encodeVrackNetwork';
import { urls, subRoutes } from '../../../../../routes/routes.constant';

const testVrack = mockVrackSegmentList[0];
const initialRoute = urls.vrackSegmentDeleteNetwork
  .replace(subRoutes.dashboard, organizationList[0].id)
  .replace(subRoutes.vdcId, datacentreList[0].id)
  .replace(subRoutes.vrackSegmentId, testVrack.id)
  .replace(
    subRoutes.vrackNetworkId,
    encodeVrackNetwork(testVrack.targetSpec.networks[0]),
  );

const {
  managed_vcd_dashboard_vrack_delete_network: title,
  managed_vcd_dashboard_vrack_delete_network_content1: content,
  managed_vcd_dashboard_vrack_delete_network_content2: content2,
  managed_vcd_dashboard_vrack_delete_network_success: success,
  managed_vcd_dashboard_vrack_delete_network_error: error,
} = labels.datacentresVrackSegment;

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
    const modal = screen.getByTestId('modal');

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    expect(submitCta).toBeEnabled();
    await act(() => userEvent.click(submitCta));

    // check modal visibility
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
    const modal = screen.getByTestId('modal');

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
    await waitFor(() => expect(modal).not.toBeInTheDocument(), {
      timeout: 10_000,
    });

    // check error banner
    const testError = error.replace('{{errorApi}}', '');
    expect(screen.getByText(testError)).toBeVisible();
  });
});
