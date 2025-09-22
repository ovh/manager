import { ReactElement } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import { RegionTile, isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { TabsComponent } from '@ovh-ux/manager-react-components';

import { TLocation } from '@/types/region';

import { RegionList } from './RegionList.component';
import { useRegionSelector } from './useRegionSelector';

export type RegionSelectorProps = {
  projectId: string;
  onSelectRegion: (region: TLocation | null) => void;
  regionFilter?: (region: TLocation) => boolean;
  compactMode?: boolean;
};

export function RegionSelector({
  projectId,
  onSelectRegion,
  regionFilter,
  compactMode,
}: Readonly<RegionSelectorProps>): ReactElement {
  const { t } = useTranslation('region-selector');

  const { data: project } = useProject(projectId);
  const isDiscovery = isDiscoveryProject(project);

  const {
    continents,
    macroRegions,
    microRegions,
    selectContinent: setSelectedContinent,
    selectMacroRegion,
    selectMicroRegion,
    selectedMacroRegion,
    selectedRegionIsDisabled,
    selectedMicroRegion,
    isPending,
  } = useRegionSelector({ projectId, onSelectRegion, regionFilter });

  if (isPending) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <TabsComponent
      items={continents}
      itemKey={(i) => i.name}
      contentElement={() => (
        <>
          <RegionList
            isUnselectableRegion={isDiscovery}
            regions={macroRegions}
            selectedRegion={selectedMacroRegion}
            onClick={selectMacroRegion}
            render={(region: TLocation, isSelected) => (
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
                <OsdsText
                  className="font-bold"
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._400}
                >
                  {t('pci_project_regions_list_region')}
                </OsdsText>
              </div>
              <RegionList
                isUnselectableRegion={isDiscovery}
                regions={microRegions}
                selectedRegion={selectedMicroRegion}
                onClick={selectMicroRegion}
                render={(region: TLocation, isSelected) => (
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_TEXT_LEVEL.body}
                    size={isSelected ? ODS_TEXT_SIZE._500 : ODS_TEXT_SIZE._400}
                  >
                    {region.name}
                  </OsdsText>
                )}
              />
            </>
          )}
          {selectedRegionIsDisabled && (
            <OsdsText
              className="font-bold p-6 flex pt-0"
              color={ODS_THEME_COLOR_INTENT.error}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
            >
              {t('pci_project_flavors_desactivated_region')}
            </OsdsText>
          )}
        </>
      )}
      titleElement={(continent, isSelected) => (
        <OsdsText
          breakSpaces={false}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={isSelected ? ODS_THEME_COLOR_INTENT.text : ODS_THEME_COLOR_INTENT.primary}
        >
          <div className={clsx(isSelected && 'font-bold', 'whitespace-nowrap px-2 text-lg')}>
            {continent.name}
          </div>
        </OsdsText>
      )}
      onChange={setSelectedContinent}
    />
  );
}
