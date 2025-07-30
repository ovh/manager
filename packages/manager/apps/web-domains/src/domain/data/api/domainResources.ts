import { v2, v6 } from '@ovh-ux/manager-core-api';
import { TDomainOption, TDomainResource } from '@/domain/types/domainResource';
import { OptionEnum } from '@/common/enum/option.enum';

/**
 *  : Get this Domain properties
 */
export const getDomainResource = async (
  serviceName: string,
): Promise<TDomainResource> => {
  const { data } = await v2.get(`/domain/name/${serviceName}`);
  return data;
};

export const getDomainAnycastOption = async (
  serviceName: string,
): Promise<TDomainOption> => {
  const { data } = await v6.get(
    `/domain/${serviceName}/option/${OptionEnum.DNS_ANYCAST}`,
  );
  return data;
};

/**
 *  : Update a domain resource
 */
export const updateDomainResource = async (
  serviceName: string,
  payload: {
    checksum: string;
    targetSpec: {
      dnsConfiguration: {
        nameServers: {
          nameServer: string;
          ipv4?: string;
          ipv6?: string;
        }[];
      };
    };
  },
): Promise<void> => {
  const { data } = await v2.put(`/domain/name/${serviceName}`, payload);
  return data;
};
