import { useTranslation } from 'react-i18next';

import { CARD_COLOR, Card, DIVIDER_SPACING, Divider, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import { converToDisplayBandwidth } from '@/utils/bandwidth';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { Flag } from '../flag/Flag';
import { IpTable } from '../ip-table/IpTable';

interface RegionTileProps {
  region: string;
  bandwidthLimit: number;
  ipv4List: string[];
  ipv6List: string[];
}

export const RegionTile = ({ region, bandwidthLimit, ipv4List, ipv6List }: RegionTileProps) => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.publicIpRouting]);
  const displayedBandwidth = converToDisplayBandwidth(bandwidthLimit);
  const formattedBandwidth = `${displayedBandwidth.value} ${displayedBandwidth.unit}`;
  return (
    <Card className="w-96 flex-col p-6" color={CARD_COLOR.neutral}>
      <section className="flex w-full flex-col">
        <div className="flex">
          <Flag region={region} />
          <Text preset={TEXT_PRESET.heading4}>{region}</Text>
        </div>
        <Divider className="w-full" spacing={DIVIDER_SPACING._24} />
        <dl className="m-0 flex flex-col">
          <Tile.Item.Root>
            <Tile.Item.Term label={t('publicIpRouting_region_publicBandwidth')} />
            <Tile.Item.Description label={formattedBandwidth} />
          </Tile.Item.Root>
        </dl>
        <div>
          <IpTable ipv4List={ipv4List} ipv6List={ipv6List} />
        </div>
      </section>
    </Card>
  );
};
