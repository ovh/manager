import JSURL from 'jsurl';
import { IpOffer, IpVersion } from './order.constant';
import {
  IP_FAILOVER_PLANCODE,
  getContinentKeyFromRegion,
  getDatacenterFromRegion,
} from '@/data/hooks/catalog/catalog.utils';
import { ServiceType } from '@/types';

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
};

/**
 * Returns the express order plan code to use
 */
const getPlanCode = (
  planCode: string,
  serviceType: ServiceType,
  region: string,
) =>
  serviceType === ServiceType.ipParking
    ? IP_FAILOVER_PLANCODE[getContinentKeyFromRegion(region)]
    : planCode;

/**
 * Returns the express order settings
 */
export const getAdditionalIpsProductSettings = ({
  serviceName,
  serviceType,
  planCode,
  region,
  offer,
  geolocation,
  organisation,
  quantity = 1,
}: OrderParams) =>
  JSURL.stringify({
    configuration: [
      { label: 'destination', value: serviceName },
      geolocation && { label: 'country', value: geolocation.toUpperCase() },
      organisation && { label: 'organisation', value: organisation },
      region && { label: 'datacenter', value: getDatacenterFromRegion(region) },
    ].filter(Boolean),
    duration: 'P1M',
    planCode: getPlanCode(planCode, serviceType, region),
    pricingMode: 'default',
    productId:
      serviceType === ServiceType.dedicatedCloud ? 'privateCloud' : 'ip',
    quantity: offer === IpOffer.blockAdditionalIp ? 1 : quantity,
    datacenter: region ? getDatacenterFromRegion(region) : null,
  });

/**
 * Returns true if Additional IP is available for this service type
 */
export const hasAdditionalIpOffer = (serviceType: ServiceType) =>
  [ServiceType.ipParking, ServiceType.server, ServiceType.vps].includes(
    serviceType,
  );

/**
 * Returns true if Additional IP Block is available for this service type
 */
export const hasAdditionalIpBlockOffer = (serviceType: ServiceType) =>
  [
    ServiceType.dedicatedCloud,
    ServiceType.ipParking,
    ServiceType.vrack,
    ServiceType.server,
  ].includes(serviceType);

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
