import {
  Filter,
  FilterComparator,
  apiClient,
  fetchIcebergV6,
} from '@ovh-ux/manager-core-api';
import { IpObject } from '@/types/ipObject';
import { IpTypeEnum } from '@/data/constants';

export type GetIpListParams = {
  /** Filter the value of campus property (ilike) (alpha) */
  campus?: string;
  /** Filter the value of description property (like) */
  description?: string;
  /** Filter resources on IAM tags */
  iamTags?: Record<string, string>;
  /** Filter the value of ip property (contains or equals) */
  ip?: string;
  /** Filter the value of isAdditionalIp property (&#x3D;) (alpha) */
  isAdditionalIp?: boolean;
  /** Filter the value of routedTo.serviceName property (like) */
  'routedTo.serviceName'?: string | null;
  /** Filter the value of type property (&#x3D;) */
  type?: IpTypeEnum;
  /** Filter the value of version property (&#x3D;) (alpha) */
  version?: number;
};

export const getIpListQueryKey = (params: GetIpListParams) => [
  `get/ip:${encodeURIComponent(JSON.stringify(params))}`,
];

const getIpListParamToQueryString = (params: GetIpListParams) =>
  Object.entries(params).reduce((query, [key, value]) => {
    if (key === 'type' && value === IpTypeEnum.ADDITIONAL) {
      query.append('isAdditionalIp', 'true');
    } else if (key !== 'ip' && value !== undefined) {
      query.append(key, String(value));
    }
    return query;
  }, new URLSearchParams());

/**
 * List the ip.Ip objects : Your OVH IPs
 */
export const getIpList = (params: GetIpListParams) =>
  apiClient.v6.get<string[]>(`/ip?${getIpListParamToQueryString(params)}`);

export const getIcebergIpList = (params: GetIpListParams) => {
  const filters = [
    ...Object.entries(params)
      .filter(
        ([key, value]) => !(key === 'type' && value === IpTypeEnum.ADDITIONAL),
      )
      .map(([key, value]) => ({
        key,
        value,
        comparator: FilterComparator.IsEqual,
      })),
    {
      key: 'isAdditionalIp',
      value: params.type === IpTypeEnum.ADDITIONAL,
      comparator: FilterComparator.IsEqual,
    },
  ] as Filter[];

  return fetchIcebergV6<IpObject>({
    route: '/ip',
    filters,
  });
};
