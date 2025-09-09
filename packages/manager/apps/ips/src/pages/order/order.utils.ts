import JSURL from 'jsurl';
import { DEFAULT_PRICING_MODE, IpOffer } from './order.constant';
import { getDatacenterFromRegion } from '@/data/hooks/catalog/catalog.utils';
import { ServiceType, IpVersion } from '@/types';

export type OrderParams = {
  serviceName: string;
  serviceType: ServiceType;
  planCode: string;
  ipVersion: IpVersion;
  region?: string;
  offer: IpOffer;
  geolocation: string;
  organisation: string;
  quantity?: number;
  pricingMode?: string;
};

/**
 * Returns the express order settings
 */
export const getAdditionalIpsProductSettings = ({
  ipVersion,
  serviceName,
  serviceType,
  planCode,
  region,
  offer,
  geolocation,
  organisation,
  quantity = 1,
  pricingMode = DEFAULT_PRICING_MODE,
}: OrderParams) =>
  JSURL.stringify({
    configuration: [
      { label: 'destination', value: serviceName },
      geolocation && { label: 'country', value: geolocation.toUpperCase() },
      organisation && { label: 'organisation', value: organisation },
      ipVersion === IpVersion.ipv6 && { label: 'ip_region', value: region },
      region &&
        ipVersion === IpVersion.ipv4 &&
        ![
          ServiceType.vps,
          ServiceType.dedicatedCloud,
          ServiceType.server,
        ].includes(serviceType) && {
          label: 'datacenter',
          value: getDatacenterFromRegion(region),
        },
    ].filter(Boolean),
    duration: 'P1M',
    planCode,
    pricingMode,
    productId:
      serviceType === ServiceType.dedicatedCloud ? 'privateCloud' : 'ip',
    quantity: offer === IpOffer.blockAdditionalIp ? 1 : quantity,
    serviceName:
      serviceType === ServiceType.dedicatedCloud ? serviceName : null,
    datacenter:
      region &&
      ipVersion === IpVersion.ipv4 &&
      ![
        ServiceType.vps,
        ServiceType.dedicatedCloud,
        ServiceType.server,
      ].includes(serviceType)
        ? getDatacenterFromRegion(region)
        : null,
  });

export const offerPossibilitiesByServiceType = {
  [IpOffer.blockAdditionalIp]: [
    ServiceType.dedicatedCloud,
    ServiceType.vrack,
    ServiceType.ipParking,
    ServiceType.server,
  ],
  [IpOffer.additionalIp]: [
    ServiceType.ipParking,
    ServiceType.server,
    ServiceType.vps,
  ],
};

/**
 * Returns true if Additional IP is available for this service type
 */
export const hasAdditionalIpOffer = (serviceType: ServiceType) =>
  offerPossibilitiesByServiceType[IpOffer.additionalIp].includes(serviceType);

/**
 * Returns true if Additional IP Block is available for this service type
 */
export const hasAdditionalIpBlockOffer = (serviceType: ServiceType) =>
  offerPossibilitiesByServiceType[IpOffer.blockAdditionalIp].includes(
    serviceType,
  );

/**
 * Returns a function that returns true if the current organisation is available for the provided region
 */
export const isAvailableOrganisation = (selectedPlanCode: string) => (
  organisation: string,
) => {
  if (selectedPlanCode.includes('ripe')) return organisation.includes('RIPE');
  if (selectedPlanCode.includes('arin')) return organisation.includes('ARIN');
  return true;
};
