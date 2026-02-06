import { useTranslation } from 'react-i18next';

import { SPINNER_SIZE, Spinner, Text } from '@ovhcloud/ods-react';

import { useGetBandwidthByRegions } from '@/hooks/vrack-ip/useGetBandwidthByRegions';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { RegionTile } from '../region-tile/RegionTile';

interface RegionTilesProps {
  serviceName: string;
}

export const RegionTiles = (props: RegionTilesProps) => {
  const serviceName = props.serviceName;
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const { regionsWithBandwidth, isLoading } = useGetBandwidthByRegions(serviceName);

  return isLoading ? (
    <div className="flex w-full justify-center">
      <Spinner size={SPINNER_SIZE.lg} />
    </div>
  ) : regionsWithBandwidth.length ? (
    <div className="flex w-full flex-wrap justify-start gap-6">
      {regionsWithBandwidth.map(({ region, bandwidthLimit, ipv4List, ipv6List }) => (
        <RegionTile
          key={region}
          region={region}
          bandwidthLimit={bandwidthLimit}
          ipv4List={ipv4List}
          ipv6List={ipv6List}
        />
      ))}
    </div>
  ) : (
    <div className="mt-14 flex w-full flex-wrap">
      <Text>{t('publicIpRouting_no_eligible_region_found')}</Text>
    </div>
  );
};
