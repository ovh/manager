import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import { subRoutes, urls } from '../../../../../routes/routes.constant';
import { labels, renderTest } from '../../../../../test-utils';

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
  vrackSegment: SAFE_MOCK_DATA.vrackSegmentStandard,
};

const initialRoute = urls.vrackSegmentDelete
  .replace(subRoutes.dashboard, config.org.id)
  .replace(subRoutes.vdcId, config.vdc.id)
  .replace(subRoutes.vrackSegmentId, config.vrackSegment.id);

const {
  managed_vcd_dashboard_vrack_delete_segment: title,
  managed_vcd_dashboard_vrack_delete_segment_content: content,
  managed_vcd_dashboard_vrack_delete_segment_success: success,
  managed_vcd_dashboard_vrack_delete_segment_error: error,
  managed_vcd_dashboard_vrack_column_segment_vrack_label: labelVrack,
} = labels.datacentresVrackSegment;

const checkModalContent = () => {
  expect(screen.getByText(title)).toBeVisible();
  expect(screen.getByText(content)).toBeVisible();
};

const WAIT_OPTIONS = { timeout: 10_000 };
const varRegex = (key: string) => new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');

describe('Delete Vrack Network Page', () => {
  it('should delete the network and display a success banner', async () => {
    await renderTest({ initialRoute });

    // check modal content
    await waitFor(() => checkModalContent(), WAIT_OPTIONS);
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

    const submitCta = screen.getByTestId('primary-button');

    await waitFor(() => expect(submitCta).toBeEnabled(), WAIT_OPTIONS);

    fireEvent.click(submitCta);

    // check modal visibility
    await waitFor(() => expect(modal).not.toBeInTheDocument(), WAIT_OPTIONS);

    // check success banner

    expect(
      screen.getByText(
        success.replace(
          varRegex('vrack'),
          labelVrack.replace(varRegex('vlanId'), config.vrackSegment.currentState.vlanId),
        ),
      ),
    ).toBeVisible();
  });

  // TODO : unskip when page is unmocked
  it.skip('should display an error if deleteService is KO', async () => {
    await renderTest({
      initialRoute,
      isVrackSegmentDeleteKo: true,
    });

    // check modal content
    await waitFor(() => checkModalContent(), WAIT_OPTIONS);
    const modal = screen.getByTestId('modal');

    // submit modal
    const submitCta = screen.getByTestId('primary-button');
    expect(submitCta).toBeEnabled();
    await act(() => userEvent.click(submitCta));

    // check modal visibility
    await waitFor(() => expect(modal).not.toBeInTheDocument(), WAIT_OPTIONS);

    // check error banner
    const testError = error.split(':')[0];
    if (!testError) {
      throw new Error('Error message is not defined');
    }

    expect(screen.getByText(testError)).toBeVisible();
  });
});
