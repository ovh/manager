import { act, screen } from '@testing-library/react';
import { expect } from 'vitest';
import {
  organizationList,
  datacentreList,
  mockVrackSegmentList,
} from '@ovh-ux/manager-module-vcd-api';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { renderTest } from '../../../../../test-utils';
import fr_FR from '../../../../../../public/translations/datacentres/vrack-segment/Messages_fr_FR.json';

const queryModalTitle = () => {
  return screen.queryByText(
    (content, element) =>
      element?.tagName === 'ODS-TEXT' &&
      element?.getAttribute('preset') === 'heading-4' &&
      content === fr_FR.managed_vcd_dashboard_vrack_edit_vlan,
  );
};

const checkFormInputAndCta = (container: HTMLElement) => {
  expect(
    screen.getByText(fr_FR.managed_vcd_dashboard_vrack_edit_vlan),
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

const expectSubmitButton = (container) =>
  expect(container.querySelector('ods-button[label="modify"]'));

const submitForm = (container: HTMLElement) => {
  return act(() =>
    userEvent.click(
      container.querySelector('ods-button[label="modify"]') as Element,
    ),
  );
};

const editVlanValue = (newValue: string | number) => {
  const odsQuantity = document.querySelector(
    'ods-quantity[name="vlanId"]',
  ) as HTMLElement & { value?: number };

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
  screen.queryByText(
    fr_FR.managed_vcd_dashboard_vrack_edit_error.replace('{{errorApi}}', ''),
  );
};

// Check modal is closed and success message is shown
describe('Edit Vrack Segment Id Page', () => {
  it('The form is displayed and can be submitted', async () => {
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/edit`,
    });

    await waitFor(
      () => {
        expect(queryModalTitle()).toBeInTheDocument();
      },
      { timeout: 3_000 },
    );

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkVlanValue(container, mockVrackSegmentList[0].targetSpec.vlanId);
      },
      { timeout: 2000 },
    );

    expectSubmitButton(container).toBeDisabled();

    await editVlanValue(430);

    await waitFor(() => expectSubmitButton(container).not.toBeDisabled(), {
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
    const { container } = await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/edit`,
      isVrackSegmentUpdateKo: true,
    });

    await waitFor(() => {
      expect(queryModalTitle()).toBeInTheDocument();
    });

    await waitFor(
      () => {
        checkFormInputAndCta(container);
        checkVlanValue(container, mockVrackSegmentList[0].targetSpec.vlanId);
      },
      { timeout: 2000 },
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
    await renderTest({
      initialRoute: `/${organizationList[0].id}/virtual-datacenters/${datacentreList[0].id}/vrack-segments/${mockVrackSegmentList[0].id}/edit`,
      isVrackSegmentKO: true,
    });

    await waitFor(() => {
      expect(queryModalTitle()).toBeInTheDocument();
    });

    await waitFor(() => expect(screen.getByText('Oops …!')).toBeVisible(), {
      timeout: 2000,
    });
  });
});
