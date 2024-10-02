import React, { useCallback, useMemo, useState } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  getMacroRegion,
  getZoneFromMacro,
  TabsComponent,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { TLocalisation } from './useRegions';
import { RegionTile } from './RegionTile';
import { RegionList } from './RegionList.component';

import './style.scss';
import './translations';
import { TRegion } from '@/api/data';

type TMappedRegion = TLocalisation & { zone: string };

export const splitRegions = (
  data: TRegion[],
): { regions: TMappedRegion[]; zones: string[] } => {
  const regions = data.map((region) => {
    const macro = getMacroRegion(region.name);
    return {
      ...region,
      isMacro: region.name === macro,
      macro,
      isLocalZone: region.type === 'localzone',
      zone: getZoneFromMacro(macro),
    };
  });

  return {
    regions,
    zones: ['WORLD', ...new Set(regions.map((r) => r.zone))],
  };
};

export function RegionSelector({
  compactMode,
  regions: unformattedRegions,
  onSelectRegion,
}: {
  compactMode?: boolean;
  regions: TRegion[];
  onSelectRegion: (region?: TLocalisation) => void;
}): JSX.Element {
  const { t } = useTranslation(['pci-region-selector', 'localisation']);

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [
    selectedMacroRegion,
    setSelectedMacroRegion,
  ] = useState<TMappedRegion | null>(null);
  const [
    selectedMicroRegion,
    setSelectedMicroRegion,
  ] = useState<TMappedRegion | null>(null);

  const { regions, zones } = useMemo(() => splitRegions(unformattedRegions), [
    unformattedRegions,
  ]);

  const currentRegions = useMemo(
    () =>
      (selectedZone === 'WORLD'
        ? regions
        : regions?.filter((r) => r.zone === selectedZone)) || [],
    [selectedZone, regions],
  );

  const selectMacroRegion = useCallback(
    (region: TMappedRegion) => {
      const micros = currentRegions.filter(
        (r) => r.macro === region.macro && !r.isMacro && r !== region,
      );
      setSelectedMacroRegion(region);
      setSelectedMicroRegion(null);
      console.log(currentRegions);
      onSelectRegion(micros.length === 0 ? region : null);
    },
    [currentRegions, onSelectRegion],
  );

  const selectMicroRegion = useCallback(
    (region: TMappedRegion) => {
      setSelectedMicroRegion(region);
      onSelectRegion(region);
    },
    [onSelectRegion],
  );

  // list of displayed macro regions
  const macroRegions = useMemo(
    () =>
      currentRegions.filter((region) => {
        const children = currentRegions.filter(
          (r) => r.macro === region.macro && r.isMacro === false,
        );
        // only display macro regions with one or more micro regions
        // otherwise only display the micro region
        if (region.isMacro) {
          return children.length > 1;
        }
        return children.length === 1;
      }),
    [currentRegions],
  );

  // list of displayed micro regions
  const microRegions = useMemo(
    () =>
      (macroRegions.indexOf(selectedMacroRegion) >= 0 &&
        currentRegions.filter(
          (r) =>
            r.macro === selectedMacroRegion.macro &&
            r.isMacro === false &&
            r !== selectedMacroRegion,
        )) ||
      [],
    [macroRegions, selectedMacroRegion],
  );

  return (
    <TabsComponent
      items={zones}
      itemKey={(i) => i}
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
                regions={microRegions}
                selectedRegion={selectedMicroRegion}
                onClick={selectMicroRegion}
                render={(region: TLocalisation) => region.name}
              />
            </>
          )}
        </>
      )}
      titleElement={(zone, isSelected) => (
        <OsdsText
          breakSpaces={false}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={
            isSelected
              ? ODS_THEME_COLOR_INTENT.text
              : ODS_THEME_COLOR_INTENT.primary
          }
        >
          <div
            className={clsx(
              isSelected && 'font-bold',
              'whitespace-nowrap px-2 text-lg',
            )}
          >
            {t(`region:manager_components_zone_${zone}`)}
          </div>
        </OsdsText>
      )}
      onChange={(c) => setSelectedZone(c)}
    />
  );
}
