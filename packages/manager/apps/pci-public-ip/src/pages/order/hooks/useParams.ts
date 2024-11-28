import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TInstance } from '@ovh-ux/manager-pci-common';
import { TDataState } from '@/api/hooks/useData';
import { IPTypeEnum, TCountry, TRegion } from '@/api/types';

export type OrderParams = {
  ipType: IPTypeEnum | null;
  failoverCountry: TCountry | null;
  floatingRegion: TRegion | null;
  instance: TInstance | null;
};

export const useOrderParams = (state: TDataState) => {
  const [searchParams] = useSearchParams();

  return useMemo((): OrderParams => {
    const searchParamsIpType = searchParams.get('ipType') as IPTypeEnum;
    const searchParamsRegion = searchParams.get('region');
    const searchParamsInstance = searchParams.get('instance');

    let ipType: IPTypeEnum | null = null;
    let failoverCountry: TCountry | null = null;
    let floatingRegion: TRegion | null = null;
    let instance: TInstance | null = null;

    if (Object.values(IPTypeEnum).includes(searchParamsIpType)) {
      ipType = searchParamsIpType;
    }

    if (ipType === IPTypeEnum.FAILOVER && searchParamsRegion) {
      failoverCountry = state.countries.find(
        ({ name }) => name === searchParamsRegion,
      );
    }

    if (ipType === IPTypeEnum.FLOATING && searchParamsRegion) {
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
