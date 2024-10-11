import { FC, useCallback } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TRegion } from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';
import { RegionTile } from '../../../../../components/tile/RegionTile.component';
import { TRegionItem } from '@/store/slices/form.slice';

export type TAvailableMicroRegionsProps = DeepReadonly<{
  availableMicroRegions: TRegion[];
  onRegionTileClick: ({ name, datacenter }: TRegion) => () => void;
  selectedRegion: TRegionItem | null;
}>;

export const AvailableMicroRegions: FC<TAvailableMicroRegionsProps> = ({
  availableMicroRegions,
  onRegionTileClick,
  selectedRegion,
}) => {
  const { t } = useTranslation('regions');

  const filterMicroRegions = useCallback(
    (region: TRegion) => region.datacenter === selectedRegion?.datacenter,
    [selectedRegion],
  );

  return (
    <div className="mt-10">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._500}
      >
        {t('pci_instances_regions_location')}
      </OsdsText>
      <div className="grid gap-6 pt-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-6">
        {availableMicroRegions.filter(filterMicroRegions).map((microRegion) => (
          <div key={microRegion.name}>
            <RegionTile
              label={microRegion.name}
              isSelected={microRegion.name === selectedRegion?.name}
              onTileClick={onRegionTileClick(microRegion)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
