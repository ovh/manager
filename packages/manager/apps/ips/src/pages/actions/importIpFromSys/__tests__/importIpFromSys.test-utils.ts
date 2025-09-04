import { waitFor, screen, fireEvent } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import { getButtonByLabel, labels } from '@/test-utils';
import { catalogDedicatedServerList } from '../../../../../mocks/catalog/dedicated-server-catalog';

export const VALID_INPUT_VALUES = {
  ip: '23::',
  token: 'my-token-01234567890',
};

export async function fillStep1({ ip, token } = VALID_INPUT_VALUES) {
  const ipInput = screen.getByLabelText(labels.importIpFromSys.step1IpLabel);
  await waitFor(() => fireEvent.change(ipInput, { target: { value: ip } }));

  const tokenInput = screen.getByLabelText(
    labels.importIpFromSys.step1TokenLabel,
  );
  await waitFor(() =>
    fireEvent.change(tokenInput, {
      target: { value: token },
    }),
  );
}

export async function fillStep2(
  destinationServerValue = catalogDedicatedServerList[0],
) {
  return waitFor(() => {
    const destinationServerInput = screen.getByLabelText(
      labels.importIpFromSys.step2ServerLabel,
    );

    fireEvent.change(destinationServerInput, {
      target: { value: destinationServerValue },
    });
  }, WAIT_FOR_DEFAULT_OPTIONS);
}

export async function fillStep4(container: HTMLElement) {
  const event = new CustomEvent('odsChange', {
    detail: { checked: true },
  });

  await waitFor(() => {
    const checkbox = container.querySelector('ods-checkbox');
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

  await waitFor(
    () =>
      expect(
        screen.getByText(
          labels.importIpFromSys.stepPlaceholder
            .replace('{{ current }}', stepNumber.toString())
            .replace('{{ max }}', '5'),
        ),
      ).toBeVisible(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );
}
