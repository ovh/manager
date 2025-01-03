import JSURL from 'jsurl';
import { IpOffer, IpVersion } from './order.constant';
import { getDatacenterFromRegion } from '@/data/hooks/catalog/catalog.utils';

export type OrderParams = {
  serviceName: string;
  planCode: string;
  ipVersion: IpVersion;
  region: string;
  offer: IpOffer;
  geolocation: string;
  organisation: string;
  quantity?: number;
  isPrivateCloud?: boolean;
};

export const getAdditionalIpsProductSettings = ({
  serviceName,
  planCode,
  isPrivateCloud = false,
  region,
  offer,
  geolocation,
  organisation,
  quantity = 1,
}: OrderParams) =>
  JSURL.stringify({
    configuration: [
      { label: 'destination', value: serviceName },
      { label: 'country', value: geolocation.toUpperCase() },
      { label: 'organisation', value: organisation },
      { label: 'datacenter', value: getDatacenterFromRegion(region) },
    ],
    duration: 'P1M',
    planCode,
    pricingMode: 'default',
    productId: isPrivateCloud ? 'privateCloud' : 'ip',
    quantity: offer === IpOffer.blockAdditionalIp ? 1 : quantity,
    datacenter: getDatacenterFromRegion(region),
  });
