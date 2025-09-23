import { v2, v6 } from '@ovh-ux/manager-core-api';
import {
  TDomainOption,
  TDomainResource,
  DomainService,
} from '@/domain/types/domainResource';
import { OptionEnum } from '@/common/enum/option.enum';
import { THost } from '@/domain/types/host';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';

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

export const getDomainService = async (
  serviceName: string,
): Promise<DomainService> => {
  const { data } = await v6.get(`/domain/${serviceName}`);
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
      hostsConfiguration: {
        hosts: THost[];
      };
      protectionState: ProtectionStateEnum;
    };
  },
): Promise<void> => {
  const { data } = await v2.put(`/domain/name/${serviceName}`, payload);
  return data;
};

export const getDomainAuthInfo = async (
  serviceName: string,
): Promise<string | null> => {
  const { data, status } = await v6.get(`/domain/${serviceName}/authInfo`);
  if (status !== 200) {
    return null;
  }
  return data;
};

export const transferTag = async (
  tag: string,
  serviceName: string,
): Promise<void> => {
  const { data } = await v6.post(`/domain/${serviceName}/ukOutgoingTransfer`, {
    tag,
  });
  return data;
};
