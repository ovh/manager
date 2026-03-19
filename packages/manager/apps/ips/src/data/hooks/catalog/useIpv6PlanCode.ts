import React from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  isRegionInEu,
  isRegionInUs,
} from '@/components/RegionSelector/region-selector.utils';
import { useCatalogIps } from '@/data/hooks/catalog/useCatalogIps';
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
  const isCa = !isEu && !isUs;

  const planCodeList = data?.data?.plans
    ?.map((p) => p.planCode)
    ?.filter((planCode) => planCode.includes('v6'));

  if (isCa) {
    return (
      planCodeList?.find((planCode) => planCode.includes('ca')) ||
      planCodeList?.find((planCode) => planCode.includes('arin'))
    );
  }

  if (isEu) {
    return (
      planCodeList?.find((planCode) => planCode.includes('eu')) ||
      planCodeList?.find((planCode) => planCode.includes('ripe'))
    );
  }

  return planCodeList?.find(
    (planCode) =>
      planCode.includes('arin') &&
      !planCode.includes('eu') &&
      !planCode.includes('ca'),
  );
};
