import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';

import { useGetBandwidthByRegions } from '@/hooks/vrack-ip/useGetBandwidthByRegions';

import { RegionTile } from '../region-tile/RegionTile';

interface RegionTilesProps {
  serviceName: string;
}

export const RegionTiles = (props: RegionTilesProps) => {
  const serviceName = props.serviceName;
  const { regionsWithBandwidth, isLoading } = useGetBandwidthByRegions(serviceName);

  return isLoading ? (
    <div className="flex w-full justify-center">
      <Spinner size={SPINNER_SIZE.lg} />
    </div>
  ) : (
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
  );
};
