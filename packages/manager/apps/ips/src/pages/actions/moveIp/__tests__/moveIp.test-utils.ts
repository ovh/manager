import { fireEvent, waitFor } from '@testing-library/react';

import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertOdsModalVisibility,
} from '@ovh-ux/manager-core-test-utils';

import ipList from '@/__mocks__/ip/get-ips.json';
import { urls } from '@/routes/routes.constant';
import { MockParams, getComboboxByName, renderTest } from '@/test-utils';
import { fromIpToId } from '@/utils';

export async function openMoveIpModal(options: MockParams = {}) {
  const result = await renderTest({
    initialRoute: urls.listingMoveIp.replace(':id', fromIpToId(ipList[0])),
    nbIp: 6,
    ...options,
  });
  await assertOdsModalVisibility({
    container: result.container,
    isVisible: true,
  });
  return result;
}

export async function fillStep1({
  container,
  destinationService,
  nextHop,
}: {
  container: HTMLElement;
  destinationService: string;
  nextHop?: string;
}) {
  const serviceSelect = await getComboboxByName({ container, name: 'service' });
  await waitFor(
    () =>
      expect(
        serviceSelect.querySelector(
          `ods-combobox-item[value="${destinationService}"]`,
        ),
      ).toBeInTheDocument(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );

  serviceSelect.value = destinationService;

  const event = new CustomEvent('odsValueChange', {
    detail: { value: destinationService },
  });

  await waitFor(() => fireEvent(serviceSelect, event));

  if (nextHop) {
    const nextHopSelect = await getComboboxByName({
      container,
      name: 'next-hop',
    });

    await waitFor(
      () =>
        expect(
          nextHopSelect.querySelector(`ods-combobox-item[value="${nextHop}"]`),
        ).toBeInTheDocument(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    nextHopSelect.value = nextHop;

    const event2 = new CustomEvent('odsValueChange', {
      detail: { value: nextHop },
    });

    await waitFor(() => fireEvent(nextHopSelect, event2));

    await waitFor(
      () => expect(nextHopSelect).toHaveValue(nextHop),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  }
}
