import { useTranslation } from 'react-i18next';

import { CARD_COLOR, Card, DIVIDER_SPACING, Divider, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { BandwidthOption } from '@ovh-ux/manager-network-common';
import { Tile } from '@ovh-ux/muk';

import { Ipv6Detail } from '@/data/api/get/vrackIp';
import { useBandwidthFormatConverter } from '@/hooks/useBandwidthFormatConverter';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { BandwidthOrderDrawer } from '../bandwidth-order-drawer/BandwidthOrderDrawer';
import { Flag } from '../flag/Flag';
import { IpTable } from '../ip-table/IpTable';

interface RegionTileProps {
  region: string;
  serviceName: string;
  bandwidthLimit: number;
  ipv4List: string[];
  ipv6List: Ipv6Detail[];
  bandwidthOptionList?: BandwidthOption[];
}

export const RegionTile = ({
  region,
  serviceName,
  bandwidthLimit,
  bandwidthOptionList = [],
  ipv4List,
  ipv6List,
}: RegionTileProps) => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const bandwidthConverter = useBandwidthFormatConverter();
  const currentBandwidth = bandwidthConverter(bandwidthLimit);

  return (
    <Card className="min-w-96 flex-col p-6" color={CARD_COLOR.neutral}>
      <section className="flex w-full flex-col">
        <div className="flex">
          <Flag region={region} />
          <Text preset={TEXT_PRESET.heading4}>{region}</Text>
        </div>
        <Divider className="w-full" spacing={DIVIDER_SPACING._24} />
        <dl className="m-0 flex flex-col">
          <Tile.Item.Root>
            <Tile.Item.Term label={t('publicIpRouting_region_publicBandwidth')} />
            <Tile.Item.Description label={currentBandwidth.simpleFormat}>
              <BandwidthOrderDrawer
                region={region}
                serviceName={serviceName}
                bandwidthLimit={bandwidthLimit}
                bandwidthOptionList={bandwidthOptionList}
              />
            </Tile.Item.Description>
          </Tile.Item.Root>
        </dl>
        <div>
          <IpTable serviceName={serviceName} ipv4List={ipv4List} ipv6List={ipv6List} />
        </div>
      </section>
    </Card>
  );
};
