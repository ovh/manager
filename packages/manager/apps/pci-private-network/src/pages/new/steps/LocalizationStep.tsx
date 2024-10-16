import {
  StepComponent,
  TilesInputComponent,
} from '@ovh-ux/manager-react-components';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import clsx from 'clsx';
import { TRegion } from '@/api/data/regions';
import { RegionTile } from './RegionTile';
import { useProjectAvailableRegions } from '@/api/hooks/useRegions';
import { StepsEnum, useNewNetworkStore } from '@/pages/new/store';

export type TMappedRegion = {
  name: string;
  code: string;
  macroName: string;
  microName: string;
  continentCode: string;
  continent: string;
  isLocalZone: boolean;
};

export default function LocalizationStep(): JSX.Element {
  const store = useNewNetworkStore();

  const { t } = useTranslation('new');
  const { t: tCommon } = useTranslation('common');
  const { t: tRegion } = useTranslation('region');
  const { t: tRegions, i18n } = useTranslation('regions');

  const {
    data: regions,
    isLoading: isRegionsLoading,
  } = useProjectAvailableRegions(store.project?.id);

  const [mappedRegions, setMappedRegions] = useState<TMappedRegion[]>([]);
  const [state, setState] = useState<{ selectedContinent: string }>({
    selectedContinent: undefined,
  });

  const getMacroRegion = (regionName: string) => {
    const regionSubStrings = regionName.split('-');

    const macroRegionMap = [
      null,
      regionSubStrings[0].split(/(\d)/)[0],
      regionSubStrings[0],
      regionSubStrings[2],
      regionSubStrings[2] === 'LZ' ? regionSubStrings[3] : regionSubStrings[2],
      regionSubStrings[3],
    ];
    return macroRegionMap[regionSubStrings.length] || 'Unknown_Macro_Region';
  };

  const getTranslatedMacroRegion = ({ name }: TRegion) => {
    const translatedMacroRegion = tRegion(
      `manager_components_region_${getMacroRegion(name)}`,
    );
    return translatedMacroRegion || name;
  };

  const getTranslatedRegionContinent = ({ name }: TRegion) => {
    const translatedRegionContinent = tRegion(
      `manager_components_region_continent_${getMacroRegion(name)}`,
    );
    return translatedRegionContinent || name;
  };

  const getFirstRegionByMacroName = (macroName: string) =>
    mappedRegions.find((region) => region.macroName === macroName);

  const isRegionStandalone = (region: TMappedRegion) =>
    mappedRegions.filter(
      (regionItem) => regionItem.macroName === region.macroName,
    ).length === 1;

  useEffect(() => {
    if (regions?.length > 0) {
      const result = regions.map((region) => ({
        name: region.name,
        code: region.name,
        macroName: getTranslatedMacroRegion(region),
        microName: tRegion(
          `manager_components_region_${getMacroRegion(region.name)}_micro`,
          { micro: region.name },
        ),
        continentCode: region.continentCode,
        continent: getTranslatedRegionContinent(region),
        isLocalZone: region.type === 'localzone',
      }));

      // sort regions
      // ex : ['GRA11', 'GRA7', 'GRA9'] => ['GRA7', 'GRA9', 'GRA11']
      result.sort(({ code: a }, { code: b }) => {
        const regionA = a.replace(/[\d]+/, '');
        const regionB = b.replace(/[\d]+/, '');
        if (regionA === regionB) {
          const regionIdA = parseInt(a.replace(/[^\d]+/, ''), 10) || 0;
          const regionIdB = parseInt(b.replace(/[^\d]+/, ''), 10) || 0;
          return regionIdA - regionIdB;
        }
        return regionA.localeCompare(regionB);
      });

      setMappedRegions(result);
    }
  }, [regions, i18n.language]);

  return (
    <StepComponent
      title={t('pci_projects_project_network_private_create_localisation')}
      next={
        isRegionsLoading
          ? undefined
          : {
              action: () => {
                store.updateStep.check(StepsEnum.LOCALIZATION);
                store.updateStep.lock(StepsEnum.LOCALIZATION);

                store.updateStep.open(StepsEnum.CONFIGURATION);
              },
              label: t('pci_projects_project_network_private_create_next'),
              isDisabled: mappedRegions.length === 0 || !store.form.region,
            }
      }
      edit={{
        action: () => {
          store.updateStep.unCheck(StepsEnum.LOCALIZATION);
          store.updateStep.unlock(StepsEnum.LOCALIZATION);

          store.updateStep.close(StepsEnum.CONFIGURATION);
          store.updateStep.unCheck(StepsEnum.CONFIGURATION);
          store.updateStep.unlock(StepsEnum.CONFIGURATION);

          store.updateStep.close(StepsEnum.SUMMARY);

          store.setForm({ ...store.form, createGateway: false });
        },
        label: tCommon('common_stepper_modify_this_step'),
        isDisabled: false,
      }}
      order={1}
      isOpen={store.steps.get(StepsEnum.LOCALIZATION)?.isOpen}
      isChecked={store.steps.get(StepsEnum.LOCALIZATION)?.isChecked}
      isLocked={store.steps.get(StepsEnum.LOCALIZATION)?.isLocked}
    >
      <div className="my-8">
        {mappedRegions.length ? (
          <TilesInputComponent<TMappedRegion, string, string>
            value={store.form.region}
            items={mappedRegions}
            label={(region: TMappedRegion) =>
              isRegionStandalone(region) ? (
                <RegionTile region={region} />
              ) : (
                region.name
              )
            }
            onInput={(region) => {
              store.setForm({ ...store.form, region });
            }}
            group={{
              by: (region: TMappedRegion) => region.continent,
              label: (continent: string) => (
                <OsdsText
                  breakSpaces={false}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                  color={
                    continent === state.selectedContinent
                      ? ODS_THEME_COLOR_INTENT.text
                      : ODS_THEME_COLOR_INTENT.primary
                  }
                >
                  <div
                    className={clsx(
                      continent === state.selectedContinent && 'font-bold',
                      'whitespace-nowrap px-2 text-lg',
                    )}
                  >
                    {undefined === continent
                      ? tRegions('pci_project_regions_list_continent_all')
                      : continent}
                  </div>
                </OsdsText>
              ),
              showAllTab: true,
              onChange: (continent: string) =>
                setState((prev) => ({ ...prev, selectedContinent: continent })),
            }}
            stack={{
              by: (region: TMappedRegion) => region?.macroName,
              label: (macroName: string) => (
                <RegionTile
                  region={getFirstRegionByMacroName(macroName)}
                  stack
                />
              ),
              title: () => tRegions('pci_project_regions_list_region'),
            }}
          />
        ) : (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
        )}
      </div>
    </StepComponent>
  );
}
