import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TInstance } from '@ovh-ux/manager-pci-common';
import { TDataState } from '@/api/hooks/useData';
import { TCountry, TRegion } from '@/api/types';
import { PublicIp } from '@/types/publicip.type';

export type OrderParams = {
  ipType: PublicIp | null;
  failoverCountry: TCountry | null;
  floatingRegion: TRegion | null;
  instance: TInstance | null;
};

export const useOrderParams = (state: TDataState) => {
  const [searchParams] = useSearchParams();

  return useMemo((): OrderParams => {
    const searchParamsIpType = searchParams.get('ipType') as PublicIp;
    const searchParamsRegion = searchParams.get('region');
    const searchParamsInstance = searchParams.get('instance');

    let ipType: PublicIp | null = null;
    let failoverCountry: TCountry | null = null;
    let floatingRegion: TRegion | null = null;
    let instance: TInstance | null = null;

    if (Object.values(PublicIp).includes(searchParamsIpType)) {
      ipType = searchParamsIpType;
    }

    if (ipType === PublicIp.FAILOVER && searchParamsRegion) {
      failoverCountry = state.countries.find(
        ({ name }) => name === searchParamsRegion,
      );
    }

    if (ipType === PublicIp.FLOATING && searchParamsRegion) {
      floatingRegion = state.regions.find(
        ({ name }) => name === searchParamsRegion,
      );
    }

    if (searchParamsInstance) {
      instance = state.instances.all.find(
        ({ id }) => id === searchParamsInstance,
      );
    }

    return {
      ipType,
      failoverCountry,
      floatingRegion,
      instance,
    };
  }, [searchParams, state.countries, state.instances.all, state.regions]);
};
