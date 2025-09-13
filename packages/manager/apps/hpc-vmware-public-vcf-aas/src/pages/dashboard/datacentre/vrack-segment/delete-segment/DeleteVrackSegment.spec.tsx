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

const testVrack = mockVrackSegmentList[0];
const initialRoute = urls.vrackSegmentDelete
  .replace(subRoutes.dashboard, organizationList[0].id)
  .replace(subRoutes.vdcId, datacentreList[0].id)
  .replace(subRoutes.vrackSegmentId, testVrack.id);

const {
  managed_vcd_dashboard_vrack_delete_segment: title,
  managed_vcd_dashboard_vrack_delete_segment_content: content,
  managed_vcd_dashboard_vrack_delete_segment_success: success,
  managed_vcd_dashboard_vrack_delete_segment_error: error,
} = labels.datacentresVrackSegment;

const checkModalContent = () => {
  expect(screen.getByText(title)).toBeVisible();
  expect(screen.getByText(content)).toBeVisible();
};

const WAIT_OPTIONS = { timeout: 10_000 };

describe('Delete Vrack Network Page', () => {
  it('should delete the network and display a success banner', async () => {
    await renderTest({ initialRoute });

    // check modal content
    await waitFor(() => checkModalContent(), WAIT_OPTIONS);
    const modal = screen.getByTestId('modal');

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    expect(submitCta).toBeEnabled();
    await act(() => userEvent.click(submitCta));

    // check modal visibility
    await waitFor(() => expect(modal).not.toBeInTheDocument(), WAIT_OPTIONS);

    // check success banner
    expect(screen.getByText(success)).toBeVisible();
  });

  // TODO : unskip when page is unmocked
  it.skip('should display an error if deleteService is KO', async () => {
    const { debug, container } = await renderTest({
      initialRoute,
      isVrackSegmentDeleteKo: true,
    });

    // check modal content
    await waitFor(() => checkModalContent(), WAIT_OPTIONS);
    const modal = screen.getByTestId('modal');

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    await waitFor(async () => {
      expect(submitCta).toBeEnabled();
      debug(container, Infinity);
      await act(() => userEvent.click(submitCta));
    }, WAIT_OPTIONS);

    // check modal visibility
    await waitFor(() => expect(modal).not.toBeInTheDocument(), WAIT_OPTIONS);

    // check error banner
    const testError = error.split(':')[0];
    expect(screen.getByText(testError)).toBeVisible();
  });
});
