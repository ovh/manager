import { describe, it, vi } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { Subsidiary } from '@ovh-ux/manager-config';
import {
  labels,
  getButtonByLabel,
  selectIpVersion,
  selectService,
  selectRegion,
  selectOffer,
  selectedOrganisation,
  goToOrder,
  selectIpv6Option,
  getOrganisationSelect,
} from '@/test-utils';
import { resourceMockList, organisationMockList } from '../../../mocks';
import { IpOffer, IpVersion } from './order.constant';
import { ipParkingOptionValue } from '@/types';

describe('Order', async () => {
  it.each([
    {
      case: 'vRack',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[2].name,
      region: 'eu-west-lim',
      isOrganisationSectionVisible: true,
      organisation: organisationMockList[2],
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-000001)~(label~'country~value~'DE)~(label~'organisation~value~'RIPE_1)~(label~'datacenter~value~'LIM))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'LIM))",
    },
    {
      case: 'vRack (Without Organisation)',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[2].name,
      region: 'eu-west-lim',
      isOrganisationSectionVisible: true,
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-000001)~(label~'country~value~'DE)~(label~'datacenter~value~'LIM))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'LIM))",
    },
    {
      case: 'vRack in UK',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[3].name,
      region: 'eu-west-eri',
      isOrganisationSectionVisible: true,
      organisation: organisationMockList[3],
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-000002)~(label~'country~value~'UK)~(label~'organisation~value~'RIPE_2)~(label~'datacenter~value~'ERI))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'ERI))",
    },
    {
      case: 'vRack in CA',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[2].name,
      region: 'ca-east-bhs',
      isOrganisationSectionVisible: true,
      organisation: organisationMockList[0],
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-000001)~(label~'country~value~'CA)~(label~'organisation~value~'ARIN_1)~(label~'datacenter~value~'BHS))~duration~'P1M~planCode~'ip-v4-s30-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'BHS))",
    },
    {
      case: 'Parking + Additional IP',
      ipVersion: IpVersion.ipv4,
      serviceName: ipParkingOptionValue,
      region: 'ca-east-bhs',
      isOrganisationSectionVisible: false,
      offer: IpOffer.additionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'parking)~(label~'country~value~'CA)~(label~'datacenter~value~'BHS))~duration~'P1M~planCode~'ip-failover-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'BHS))",
    },
    {
      case: 'Parking + Block additional IP',
      ipVersion: IpVersion.ipv4,
      serviceName: ipParkingOptionValue,
      region: 'eu-west-par',
      offer: IpOffer.blockAdditionalIp,
      isOrganisationSectionVisible: true,
      organisation: organisationMockList[0],
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'parking)~(label~'country~value~'FR)~(label~'organisation~value~'ARIN_1)~(label~'datacenter~value~'PAR))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'PAR))",
    },
    {
      case: 'Parking + Block additional IP(Without Organisation)',
      ipVersion: IpVersion.ipv4,
      serviceName: ipParkingOptionValue,
      region: 'eu-west-par',
      isOrganisationSectionVisible: true,
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'parking)~(label~'country~value~'FR)~(label~'datacenter~value~'PAR))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'PAR))",
    },
    {
      case: 'Dedicated Cloud',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[0].name,
      isOrganisationSectionVisible: false,
      offer: IpOffer.blockAdditionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pcc-1)~(label~'country~value~'FR))~duration~'P1M~planCode~'pcc-option-ip-ripe-28~pricingMode~'pcc-servicepack-default~productId~'privateCloud~quantity~1~serviceName~'pcc-1~datacenter~null))",
    },
    {
      case: 'Dedicated server (additional IP)',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[4].name,
      isOrganisationSectionVisible: false,
      offer: IpOffer.additionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'ns1111111.ip-111-222-333.net)~(label~'country~value~'CA))~duration~'P1M~planCode~'ip-failover-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~null))",
    },
    {
      case: 'Dedicated server (Block additional IP)',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[4].name,
      offer: IpOffer.blockAdditionalIp,
      isOrganisationSectionVisible: true,
      organisation: organisationMockList[0],
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'ns1111111.ip-111-222-333.net)~(label~'country~value~'CA)~(label~'organisation~value~'ARIN_1))~duration~'P1M~planCode~'ip-v4-s30-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~null))",
    },
    {
      case: 'VPS',
      ipVersion: IpVersion.ipv4,
      serviceName: resourceMockList[5].name,
      isOrganisationSectionVisible: false,
      offer: IpOffer.additionalIp,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'vps-11111111.vps.ovh.ca)~(label~'country~value~'FR))~duration~'P1M~planCode~'ip-failover-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~null))",
    },
    {
      case: 'IPv6 ARIN',
      ipVersion: IpVersion.ipv6,
      serviceName: resourceMockList[2].name,
      region: 'ca-east-bhs',
      isOrganisationSectionVisible: false,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-000001)~(label~'ip_region~value~'ca-east-bhs))~duration~'P1M~planCode~'ip-v6-s56-arin~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~null))",
    },
    {
      case: 'IPv6 RIPE',
      ipVersion: IpVersion.ipv6,
      serviceName: resourceMockList[2].name,
      region: 'eu-west-gra',
      isOrganisationSectionVisible: false,
      expectedOrderLink:
        "https://www.ovh.com/fr/order/express/#/express/review?products=~(~(configuration~(~(label~'destination~value~'pn-000001)~(label~'ip_region~value~'eu-west-gra))~duration~'P1M~planCode~'ip-v6-s56-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~null))",
    },
    {
      case: 'Parking + US user and non-US region',
      ipVersion: IpVersion.ipv4,
      ovhSubsidiary: 'US',
      serviceName: ipParkingOptionValue,
      region: 'eu-west-par',
      offer: IpOffer.blockAdditionalIp,
      isOrganisationSectionVisible: false,
      expectedOrderLink:
        "?products=~(~(configuration~(~(label~'destination~value~'parking)~(label~'country~value~'FR)~(label~'datacenter~value~'PAR))~duration~'P1M~planCode~'ip-v4-s30-ripe~pricingMode~'default~productId~'ip~quantity~1~serviceName~null~datacenter~'PAR))",
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
      ovhSubsidiary,
      isOrganisationSectionVisible,
    }) => {
      const { container } = await goToOrder({
        ovhSubsidiary: ovhSubsidiary as Subsidiary,
      });

      await selectIpVersion(ipVersion);

      if (ipVersion === IpVersion.ipv6) {
        await selectIpv6Option({ container });
      }

      await selectService({ container, serviceName });

      if (region) {
        await selectRegion(region);
      }

      if (offer) {
        await selectOffer({ container, offer });
      }

      if (isOrganisationSectionVisible) {
        const organisationSelect = await getOrganisationSelect(container);
        expect(organisationSelect).toBeDefined();
        if (organisation) {
          await selectedOrganisation({ container, organisation });
        }
      } else {
        let organisationSelectFound = false;
        try {
          await getOrganisationSelect(container);
          organisationSelectFound = true;
        } catch (error) {
          // do nothing
        }
        expect(organisationSelectFound).toBeFalsy();
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

  it('displays an error message if the selected service is expired', async () => {
    const { container } = await goToOrder({ isVrackExpired: true });

    await selectIpVersion(IpVersion.ipv4);

    await selectService({ container, serviceName: resourceMockList[2].name });

    await assertTextVisibility(
      labels.order.service_selection_expired_error_message,
    );
  });

  it('displays an error message if the dedicated server cannot order ip', async () => {
    const { container } = await goToOrder({
      isDedicatedServerCannotOrderIp: true,
    });

    await selectIpVersion(IpVersion.ipv4);

    await selectService({ container, serviceName: resourceMockList[4].name });

    await assertTextVisibility(
      labels.order.service_selection_ip_quota_exceeded_error_message,
    );
  });

  it.each([
    { organisationType: ['RIPE'], region: 'eu-west-par' },
    { organisationType: ['ARIN'], region: 'ca-east-bhs' },
  ])(
    'organisation list contains $organisationType organisation when selecting $region',
    async ({ organisationType, region }) => {
      const { container } = await goToOrder();
      await selectIpVersion(IpVersion.ipv4);
      await selectService({ container, serviceName: ipParkingOptionValue });
      await selectRegion(region);
      await selectOffer({ container, offer: IpOffer.blockAdditionalIp });
      const select = await getOrganisationSelect(container);

      select
        .querySelectorAll('option')
        .forEach((option) => expect(option.value).toContain(organisationType));
    },
  );

  it('displays an error message if the service to retrieve the region is in error', async () => {
    const { container } = await goToOrder({ hasPccZoneError: true });
    await selectIpVersion(IpVersion.ipv4);
    await selectService({ container, serviceName: resourceMockList[0].name });

    await assertTextVisibility(
      labels.order.error_message.replace('{{error}}', ''),
      { exact: false },
    );
  });

  it('displays an error if catalog is KO when selecting a region', async () => {
    const { container } = await goToOrder({ isIpCatalogKo: true });
    await selectIpVersion(IpVersion.ipv4);
    await selectService({ container, serviceName: ipParkingOptionValue });

    await assertTextVisibility(
      labels.order.error_message.replace('{{error}}', ''),
      { exact: false },
    );
  });

  it('displays an error after IP version selection if resource list is KO', async () => {
    await goToOrder({ isResourceListKo: true });
    await selectIpVersion(IpVersion.ipv4);

    await assertTextVisibility(
      labels.order.error_message.replace('{{error}}', ''),
      { exact: false },
    );
  });

  it('displays an error message if we reached IPv6 order limit', async () => {
    const { container } = await goToOrder({ isIpv6LimitReached: true });
    await selectIpVersion(IpVersion.ipv6);
    await selectIpv6Option({ container });
    await selectService({ container, serviceName: resourceMockList[2].name });

    await assertTextVisibility(labels.order.ipv6_limit_reached_error);
  });
});
