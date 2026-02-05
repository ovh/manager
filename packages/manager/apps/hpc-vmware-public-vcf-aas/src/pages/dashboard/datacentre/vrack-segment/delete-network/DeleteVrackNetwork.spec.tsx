import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import { subRoutes, urls } from '../../../../../routes/routes.constant';
import { labels, renderTest } from '../../../../../test-utils';
import { encodeVrackNetwork } from '../../../../../utils/encodeVrackNetwork';

const varRegex = (key: string) => new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
  vrackSegment: SAFE_MOCK_DATA.vrackSegmentStandard,
  network: SAFE_MOCK_DATA.vrackSegmentStandard.targetSpec.networks[0] ?? '',
};

const initialRoute = urls.vrackSegmentDeleteNetwork
  .replace(subRoutes.dashboard, config.org.id)
  .replace(subRoutes.vdcId, config.vdc.id)
  .replace(subRoutes.vrackSegmentId, config.vrackSegment.id)
  .replace(subRoutes.vrackNetworkId, encodeVrackNetwork(config.network));

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
          .replace(varRegex('subnet'), config.network)
          .replace(
            varRegex('vrack'),
            labelVrack.replace(varRegex('vlanId'), config.vrackSegment.currentState.vlanId),
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
