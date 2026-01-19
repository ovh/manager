import { ReactElement } from 'react';

import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { TabsComponent } from '@ovh-ux/manager-react-components';

import useStandardPlanAvailable from '@/hooks/useStandardPlanAvailable';
import { TClusterPlanEnum } from '@/types';
import { TLocation } from '@/types/region';

import { RegionList } from './RegionList.component';
import { RegionTile } from './RegionTile.component';
import { useRegionSelector } from './useRegionSelector';

const getPlansFromRegionCodes = (codes?: string[] | null): TClusterPlanEnum[] => {
  return (
    codes?.map((code) =>
      code.includes(TClusterPlanEnum.STANDARD) ? TClusterPlanEnum.STANDARD : TClusterPlanEnum.FREE,
    ) ?? [TClusterPlanEnum.FREE]
  );
};

export type RegionSelectorProps = {
  projectId: string;
  onSelectRegion: (region: TLocation | null) => void;
  onLoadedRegion?: (data: { plans: TClusterPlanEnum[] }) => void;
  onSelectPlan?: (plan: TClusterPlanEnum) => void;
  regionFilter?: (region: TLocation) => boolean;
  compactMode?: boolean;
  selectedPlan?: TClusterPlanEnum;
};

export function RegionSelector({
  projectId,
  onSelectRegion,
  onSelectPlan,
  regionFilter,
  compactMode,
  selectedPlan,
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

  const hasStandardPlanFeature = useStandardPlanAvailable();

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
            onSelectPlan={onSelectPlan}
            selectedPlan={selectedPlan}
            isUnselectableRegion={isDiscovery}
            regions={macroRegions}
            selectedRegion={selectedMacroRegion}
            onClick={selectMacroRegion}
            filter={hasStandardPlanFeature}
            render={(region: TLocation, isSelected) => (
              <RegionTile
                key={region.name}
                region={region}
                isSelected={isSelected}
                isCompact={compactMode}
                plans={getPlansFromRegionCodes(region.codes)}
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
              className="flex p-6 pt-0 font-bold"
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
