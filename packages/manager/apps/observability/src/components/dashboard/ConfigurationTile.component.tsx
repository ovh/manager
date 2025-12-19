import { useTranslation } from 'react-i18next';

import { Skeleton, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Tile, useDateFnsLocale } from '@ovh-ux/muk';

import { ConfigurationTileProps } from '@/components/dashboard/ConfigurationTile.props';
import { formatObservabilityDuration } from '@/utils/duration.utils';

export const ConfigurationTile = ({
  retention,
  numberOfSeriesMaximum,
  isLoading,
}: ConfigurationTileProps) => {
  const { t } = useTranslation('tenants');

  const dateFnsLocale = useDateFnsLocale();

  return (
    <Tile.Root title={t('dashboard.configuration_tile.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.configuration_tile.retention')} />
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            retention && (
              <Text preset={TEXT_PRESET.span}>
                {formatObservabilityDuration(retention, dateFnsLocale)}
              </Text>
            )
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>

      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.configuration_tile.ingestion_limit')} />
        <Tile.Item.Description>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Text preset={TEXT_PRESET.span}>{numberOfSeriesMaximum}</Text>
          )}
        </Tile.Item.Description>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default ConfigurationTile;
