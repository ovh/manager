import { describe, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  renderTest,
  labels,
  WAIT_FOR_DEFAULT_OPTIONS,
  getSelectByPlaceholder,
  getButtonByLabel,
} from '@/test-utils';
import { urls } from '@/routes/routes.constant';
import { organisationMockList } from '../../../mocks';
import { IpOffer, IpVersion } from './order.constant';
import { ipParkingOptionValue } from '@/data/hooks/useServiceList';

describe('Order', async () => {
  it.each([
    {
      case: 'vRack',
      ipVersion: IpVersion.ipv4,
      serviceName: 'pn-0000001',
      region: 'eu-west-lim',
      organisation: organisationMockList[2],
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-0000001)~(label~'country~value~'DE)~(label~'organisation~value~'RIPE-1)~(label~'datacenter~value~'LIM))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'LIM))",
    },
    {
      case: 'vRack in UK',
      ipVersion: IpVersion.ipv4,
      serviceName: 'pn-0000002',
      region: 'eu-west-eri',
      organisation: organisationMockList[3],
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-0000002)~(label~'country~value~'UK)~(label~'organisation~value~'RIPE-2)~(label~'datacenter~value~'ERI))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'ERI))",
    },
    {
      case: 'vRack in CA',
      ipVersion: IpVersion.ipv4,
      serviceName: 'pn-0000001',
      region: 'ca-east-bhs',
      organisation: organisationMockList[0],
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-0000001)~(label~'country~value~'CA)~(label~'organisation~value~'ARIN-1)~(label~'datacenter~value~'BHS))~duration~'P1M~planCode~'ip-v4-s30-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'BHS))",
    },
    {
      case: 'Parking + Additional IP',
      ipVersion: IpVersion.ipv4,
      serviceName: ipParkingOptionValue,
      region: 'ca-east-bhs',
      offer: IpOffer.additionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'parking)~(label~'country~value~'CA)~(label~'datacenter~value~'BHS))~duration~'P1M~planCode~'ip-failover-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'BHS))",
    },
  ])(
    'redirect to express order successfully ($case)',
    async ({
      ipVersion,
      serviceName,
      region,
      organisation,
      offer,
      expectedOrderLink,
    }) => {
      const { container } = await renderTest({
        initialRoute: urls.order,
      });

      await waitFor(
        () => expect(screen.getByText(labels.order.title)).toBeInTheDocument(),
        WAIT_FOR_DEFAULT_OPTIONS,
      );

      // Select IPv4 or IPv6
      await waitFor(() =>
        userEvent.click(
          screen.getByText(
            ipVersion === IpVersion.ipv4
              ? labels.order.ipv4_card_title
              : labels.order.ipv6_card_title,
          ),
        ),
      );

      // Select service
      const serviceSelect = await getSelectByPlaceholder({
        container,
        placeholder: labels.order.service_selection_select_placeholder,
      });

      await waitFor(() => {
        serviceSelect.value = serviceName;
      });

      // Select region
      if (region) {
        let countryOption: HTMLElement;
        await waitFor(() => {
          countryOption = screen.getByText(region);
          expect(countryOption).toBeInTheDocument();
        }, WAIT_FOR_DEFAULT_OPTIONS);

        await waitFor(() => userEvent.click(countryOption));
      }

      // Select offer
      let offerOption: HTMLElement;
      await waitFor(() => {
        offerOption = screen.getByText(
          offer === IpOffer.blockAdditionalIp
            ? labels.order.additional_ip_block_card_title
            : labels.order.additional_ip_card_title,
        );
        expect(offerOption).toBeInTheDocument();
      }, WAIT_FOR_DEFAULT_OPTIONS);

      await waitFor(() => userEvent.click(offerOption));

      // Select organisation
      if (organisation) {
        const organisationSelect = await getSelectByPlaceholder({
          container,
          placeholder: labels.order.organisation_select_placeholder,
          nth: 1,
        });

        await waitFor(() => {
          organisationSelect.value = organisation;
        });
      }

      // Click on order button
      const orderButton = await getButtonByLabel({
        container,
        label: labels.order.order_button_label,
      });
      window.open = vi.fn();
      await waitFor(() => userEvent.click(orderButton));
      expect(window.open).toHaveBeenCalledWith(
        expectedOrderLink,
        '_blank',
        'noopener,noreferrer',
      );
    },
  );
});
