import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

import {
  datacentreList,
  mockVrackSegmentList,
  organizationList,
} from '@ovh-ux/manager-module-vcd-api';

import { subRoutes, urls } from '../../../../../routes/routes.constant';
import { labels, renderTest } from '../../../../../test-utils';
import { encodeVrackNetwork } from '../../../../../utils/encodeVrackNetwork';

const testVrack = mockVrackSegmentList[0];

const varRegex = (key: string) => new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');

const initialRoute = urls.vrackSegmentDeleteNetwork
  .replace(subRoutes.dashboard, organizationList[0].id)
  .replace(subRoutes.vdcId, datacentreList[0].id)
  .replace(subRoutes.vrackSegmentId, testVrack.id)
  .replace(subRoutes.vrackNetworkId, encodeVrackNetwork(testVrack.targetSpec.networks[0]));

const {
  managed_vcd_dashboard_vrack_delete_network: title,
  managed_vcd_dashboard_vrack_delete_network_content1: content,
  managed_vcd_dashboard_vrack_delete_network_content2: content2,
  managed_vcd_dashboard_vrack_delete_network_success: success,
  managed_vcd_dashboard_vrack_delete_network_error: error,
  managed_vcd_dashboard_vrack_column_segment_vrack_label: labelVrack,
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

    const confirmKeyword = 'DELETE';
    const confirmInput = screen.getByPlaceholderText(confirmKeyword);

    fireEvent(
      confirmInput,
      new CustomEvent('odsChange', {
        bubbles: true,
        detail: { value: confirmKeyword },
      } as CustomEventInit),
    );

    // submit modal
    const submitCta = screen.getByTestId('primary-button');

    await waitFor(() => expect(submitCta).toBeEnabled(), {
      timeout: 10_000,
    });

    fireEvent.click(submitCta);

    // check modal visibility
    await waitFor(() => expect(modal).not.toBeInTheDocument(), {
      timeout: 10_000,
    });

    expect(
      screen.getByText(
        success
          .replace(varRegex('subnet'), testVrack.targetSpec.networks[0])
          .replace(
            varRegex('vrack'),
            labelVrack.replace(varRegex('vlanId'), testVrack.currentState.vlanId),
          ),
      ),
    ).toBeVisible();
  });

  // TODO : unskip when page is unmocked
  it.skip('should display an error if updateService is KO', async () => {
    await renderTest({
      initialRoute,
      isVrackSegmentUpdateKo: true,
    });

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

    // check error banner
    const testError = error.replace('{{errorApi}}', '');
    expect(screen.getByText(testError)).toBeVisible();
  });
});
