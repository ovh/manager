import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useCatalogIps } from '@/data/hooks/catalog/useCatalogIps';
import {
  isRegionInEu,
  isRegionInUs,
} from '@/components/RegionSelector/region-selector.utils';
import { IpVersion } from '@/types';

export const useIpv6PlanCode = ({
  region,
  ipVersion,
}: {
  region: string;
  ipVersion: IpVersion;
}) => {
  const { environment } = React.useContext(ShellContext);
  const { data } = useCatalogIps({
    subsidiary: environment.user.ovhSubsidiary,
    enabled: ipVersion === IpVersion.ipv6,
  });

  const isEu = isRegionInEu(region);
  const isUs = isRegionInUs(region);
  return data?.data?.plans
    ?.map((p) => p.planCode)
    ?.find(
      (planCode) =>
        planCode.includes('v6') &&
        (isUs || planCode.includes(isEu ? 'ripe' : 'arin')),
    );
};
