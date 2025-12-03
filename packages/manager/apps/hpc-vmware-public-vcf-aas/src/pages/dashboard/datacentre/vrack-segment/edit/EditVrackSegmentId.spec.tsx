import { waitFor } from '@testing-library/dom';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

import { subRoutes } from '@/routes/routes.constant';
import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import fr_FR from '../../../../../../public/translations/datacentres/vrack-segment/Messages_fr_FR.json';
import { labels, renderTest } from '../../../../../test-utils';

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
  vdc: SAFE_MOCK_DATA.vdcStandard,
  vrackSegment: SAFE_MOCK_DATA.vrackSegmentStandard,
};
const initialRoute = `/${config.org.id}/virtual-datacenters/${config.vdc.id}/vrack-segments/${config.vrackSegment.id}/${subRoutes.vrackEditVlanId}`;

const queryModalTitle = () => {
  return screen.queryByText(
    (content, element) =>
      element?.tagName === 'ODS-TEXT' &&
      element?.getAttribute('preset') === 'heading-4' &&
      content === fr_FR.managed_vcd_dashboard_vrack_edit_vlan,
  );
};

const checkFormInputAndCta = (container: HTMLElement) => {
  expect(screen.getByText(fr_FR.managed_vcd_dashboard_vrack_edit_vlan)).toBeVisible();
  expect(container.querySelector(`[label="${labels.commun.actions.modify}"]`)).toBeVisible();
  expect(container.querySelector(`[label="${labels.commun.actions.cancel}"]`)).toBeVisible();

  const input = container.querySelector('input[name="vlanId"]');

  expect(input).toBeInTheDocument();
};

const checkVlanValue = (container: HTMLElement, vlanId: string) => {
  const input = container.querySelector('input[name="vlanId"]');

  expect(input).toHaveAttribute('value', vlanId);
};

const getSubmitButton = (container: HTMLElement) =>
  container.querySelector(`ods-button[label="${labels.commun.actions.modify}"]`);

const submitForm = (container: HTMLElement) => {
  const submitButton = getSubmitButton(container);
  if (!submitButton) {
    throw new Error('Submit button not found');
  }
  return act(() => userEvent.click(submitButton));
};

const editVlanValue = (newValue: string | number) => {
  const odsQuantity = document.querySelector<HTMLElement & { value: number }>(
    'ods-quantity[name="vlanId"]',
  );

  if (!odsQuantity) throw new Error('ods-quantity not found');

  return act(() => {
    // Set value explicitly via custom element setter
    odsQuantity.value = Number(newValue);

    // Dispatch the custom event expected by the component
    odsQuantity.dispatchEvent(
      new CustomEvent('odsChange', {
        detail: { value: Number(newValue) },
        bubbles: true,
        composed: true,
      }),
    );
  });
};

const checkSuccessBannerIsVisible = () => {
  screen.getByText(fr_FR.managed_vcd_dashboard_vrack_edit_success);
};

const checkErrorBannerIsVisible = () => {
  screen.queryByText(fr_FR.managed_vcd_dashboard_vrack_edit_error.replace('{{errorApi}}', ''));
};

// Check modal is closed and success message is shown
describe('Edit Vrack Segment Id Page', () => {
  it('The form is displayed and can be submitted', async () => {
    const { container } = await renderTest({ initialRoute });

    await waitFor(
      () => {
        expect(queryModalTitle()).toBeInTheDocument();
      },
      { timeout: 5_000 },
    );

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkVlanValue(container, config.vrackSegment.targetSpec.vlanId);
      },
      { timeout: 5_000 },
    );

    const submitButton = getSubmitButton(container);
    expect(submitButton).toBeDefined();
    expect(submitButton).toBeDisabled();

    editVlanValue(430);

    await waitFor(() => expect(submitButton).not.toBeDisabled(), {
      timeout: 2000,
    });

    await submitForm(container);

    await waitFor(
      () => {
        expect(queryModalTitle()).not.toBeInTheDocument();
        checkSuccessBannerIsVisible();
      },
      { timeout: 2000 },
    );
  });

  it('The form is displayed and can be submitted and we show error', async () => {
    const { container } = await renderTest({ initialRoute, isVrackSegmentUpdateKo: true });

    await waitFor(() => {
      expect(queryModalTitle()).toBeInTheDocument();
    });

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkVlanValue(container, config.vrackSegment.targetSpec.vlanId);
      },
      { timeout: 5_000 },
    );

    await submitForm(container);

    await waitFor(
      () => {
        expect(queryModalTitle()).toBeInTheDocument();
        checkErrorBannerIsVisible();
      },
      { timeout: 2000 },
    );
  });

  // TODO : unskip when page is unmocked
  it.skip('The form is not visible and we see error', async () => {
    await renderTest({ initialRoute, isVrackSegmentKO: true });

    await waitFor(() => {
      expect(queryModalTitle()).toBeInTheDocument();
    });

    await waitFor(() => expect(screen.getByText('Oops …!')).toBeVisible(), {
      timeout: 2000,
    });
  });
});
