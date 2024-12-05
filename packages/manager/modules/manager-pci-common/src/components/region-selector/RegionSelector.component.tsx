import { TabsComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { TLocalisation } from './useRegions';
import { useRegionSelector } from './useRegionSelector';
import { RegionTile } from './RegionTile';
import { RegionList } from './RegionList.component';
import '../../translations/region-selector';

import './style.scss';

export interface RegionSelectorProps {
  projectId: string;
  onSelectRegion: (region?: TLocalisation) => void;
  regionFilter?: (region: TLocalisation) => boolean;
  compactMode?: boolean;
}

export function RegionSelector({
  projectId,
  onSelectRegion,
  regionFilter,
  compactMode,
}: Readonly<RegionSelectorProps>): JSX.Element {
  const { t } = useTranslation('pci-region-selector');

  const {
    continents,
    macroRegions,
    microRegions,
    selectContinent: setSelectedContinent,
    selectMacroRegion,
    selectMicroRegion,
    selectedMacroRegion,
    selectedMicroRegion,
    isPending,
  } = useRegionSelector({ projectId, onSelectRegion, regionFilter });

  if (isPending) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <TabsComponent
      items={continents}
      itemKey={(i) => i.id}
      contentElement={() => (
        <>
          <RegionList
            regions={macroRegions}
            selectedRegion={selectedMacroRegion}
            onClick={selectMacroRegion}
            render={(region: TLocalisation, isSelected) => (
              <RegionTile
                key={region.name}
                region={region}
                isSelected={isSelected}
                isCompact={compactMode}
              />
            )}
          />
          {microRegions?.length > 0 && (
            <>
              <div className="ml-8">
                <OdsText preset="span" className="font-bold">
                  {t('pci_project_regions_list_region')}
                </OdsText>
              </div>
              <RegionList
                regions={microRegions}
                selectedRegion={selectedMicroRegion}
                onClick={selectMicroRegion}
                render={(region: TLocalisation) => region.name}
              />
            </>
          )}
        </>
      )}
      titleElement={(continent, isSelected) => (
        <div
          className={clsx(
            isSelected && 'font-bold',
            'whitespace-nowrap px-2 text-lg',
          )}
        >
          <OdsText>{continent.name}</OdsText>
        </div>
      )}
      onChange={setSelectedContinent}
    />
  );
}
