import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  labels,
  WAIT_FOR_DEFAULT_OPTIONS,
  getSelectByPlaceholder,
  getOdsCardByContentText,
  renderTest,
} from '@/test-utils';
import { IpOffer, IpVersion } from '../pages/order/order.constant';
import { urls } from '@/routes/routes.constant';
import { MockParams } from './render-test';

export const goToOrder = async (mockParams: MockParams = {}) => {
  const result = renderTest({
    initialRoute: urls.order,
    ...mockParams,
  });

  await waitFor(
    () => expect(screen.getByText(labels.order.title)).toBeInTheDocument(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );

  return result;
};

export const selectIpVersion = async (ipVersion: IpVersion) =>
  waitFor(() =>
    userEvent.click(
      screen.getByText(
        ipVersion === IpVersion.ipv4
          ? labels.order.ipv4_card_title
          : labels.order.ipv6_card_title,
      ),
    ),
  );

export const selectService = async ({
  container,
  serviceName,
}: {
  container: HTMLElement;
  serviceName: string;
}) => {
  const serviceSelect = await getSelectByPlaceholder({
    container,
    placeholder: labels.order.service_selection_select_placeholder,
  });

  return waitFor(() => {
    serviceSelect.value = serviceName;
  });
};

export const selectRegion = async (region: string) => {
  let countryOption: HTMLElement;

  await waitFor(() => {
    countryOption = screen.getByText(region);
    expect(countryOption).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);

  return waitFor(() => userEvent.click(countryOption));
};

export const selectOffer = async ({
  container,
  offer,
}: {
  container: HTMLElement;
  offer: IpOffer;
}) => {
  let offerOption: HTMLElement;
  await waitFor(async () => {
    const text =
      offer === IpOffer.blockAdditionalIp
        ? labels.order.additional_ip_block_card_title
        : labels.order.additional_ip_card_title;

    const subcomponent =
      offer === IpOffer.blockAdditionalIp ? 'ods-select' : 'ods-quantity';
    offerOption = await getOdsCardByContentText({
      container,
      text,
    });
    expect(offerOption.querySelector(subcomponent)).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);

  return waitFor(() => userEvent.click(offerOption));
};

export const getOrganisationSelect = async (container: HTMLElement) =>
  getSelectByPlaceholder({
    container,
    placeholder: labels.order.organisation_select_placeholder,
    nth: 1,
  });

export const selectedOrganisation = async ({
  container,
  organisation,
}: {
  container: HTMLElement;
  organisation: string;
}) => {
  const organisationSelect = await getOrganisationSelect(container);
  return waitFor(() => {
    organisationSelect.value = organisation;
  });
};

export const selectIpv6Option = async ({
  container,
}: {
  container: HTMLElement;
}) => {
  let ipv6Option: HTMLElement;
  await waitFor(async () => {
    ipv6Option = await getOdsCardByContentText({
      container,
      text: labels.order.new_prefix_ipv6_card_title,
    });
    expect(ipv6Option).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);

  return waitFor(() => userEvent.click(ipv6Option));
};
