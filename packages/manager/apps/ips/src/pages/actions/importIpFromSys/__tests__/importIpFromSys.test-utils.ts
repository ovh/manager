import { waitFor, screen, fireEvent } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { getButtonByLabel, labels } from '@/test-utils';
import { catalogDedicatedServerList } from '../../../../../mocks/catalog/dedicated-server-catalog';

export const VALID_INPUT_VALUES = {
  ip: '23::',
  token: 'my-token-01234567890',
};

export async function fillStep1({ ip, token } = VALID_INPUT_VALUES) {
  const ipEvent = new CustomEvent('odsChange', {
    detail: { value: ip },
  });
  const ipInput = screen.getByLabelText(labels.importIpFromSys.step1IpLabel);
  await waitFor(() => fireEvent(ipInput, ipEvent));

  const tokenInput = screen.getByLabelText(
    labels.importIpFromSys.step1TokenLabel,
  );

  const tokenEvent = new CustomEvent('odsChange', {
    detail: { value: token },
  });

  await waitFor(() => fireEvent(tokenInput, tokenEvent));
}

export async function fillStep2(
  destinationServerValue = catalogDedicatedServerList[0],
) {
  return waitFor(() => {
    const destinationServerInput = screen.getByLabelText(
      labels.importIpFromSys.step2ServerLabel,
    );

    const event = new CustomEvent('odsChange', {
      detail: { value: destinationServerValue },
    });

    fireEvent(destinationServerInput, event);
  }, WAIT_FOR_DEFAULT_OPTIONS);
}

export async function fillStep4(container: HTMLElement) {
  const event = new CustomEvent('odsChange', {
    detail: { checked: true },
  });

  await waitFor(() => {
    const checkbox = container
      .querySelector('ods-modal')
      .querySelector('ods-checkbox') as HTMLOdsCheckboxElement;
    checkbox.setAttribute('is-checked', '');
    return fireEvent(checkbox, event);
  }, WAIT_FOR_DEFAULT_OPTIONS);
}

export async function goToStep({
  container,
  stepNumber,
}: {
  container: HTMLElement;
  stepNumber: number;
}) {
  const nextButton = await getButtonByLabel({ container, label: 'next' });
  await waitFor(() => fireEvent.click(nextButton));

  const labelByStepNumber: { [step: number]: string } = {
    1: labels.importIpFromSys.step1Description,
    2: labels.importIpFromSys.step2Description,
    3: labels.importIpFromSys.step3Description,
    4: labels.importIpFromSys.acceptContracts,
    5: labels.importIpFromSys.step5Description,
  };

  await waitFor(
    () => expect(screen.getByText(labelByStepNumber[stepNumber])).toBeVisible(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );
}
