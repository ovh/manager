import { waitFor, fireEvent } from '@testing-library/react';
import {
  assertOdsModalVisibility,
  WAIT_FOR_DEFAULT_OPTIONS,
} from '@ovh-ux/manager-core-test-utils';
import { getComboboxByName, renderTest, MockParams } from '@/test-utils';
import { urls } from '@/routes/routes.constant';
import { fromIpToId } from '@/utils';
import ipList from '../../../../../mocks/ip/get-ips.json';

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
  }
}
