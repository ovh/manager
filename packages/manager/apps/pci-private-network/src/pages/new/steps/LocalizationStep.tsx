import {
  StepComponent,
  TilesInputComponent,
} from '@ovhcloud/manager-components';

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
import { TFormState } from '../New.page';
import { RegionTile } from './RegionTile';

type TLocalizationStep = {
  regions: TRegion[];
  isOpen: boolean;
  isChecked: boolean;
  onNext?: () => void;
  onEdit?: () => void;
  formState: TFormState;
  setFormState: (state: TFormState) => void;
  isLoading: boolean;
};

export type TMappedRegion = {
  name: string;
  code: string;
  macroName: string;
  microName: string;
  continentCode: string;
  continent: string;
  isLocalZone: boolean;
};

export default function LocalizationStep({
  regions,
  isOpen,
  isChecked,
  onNext,
  onEdit,
  formState,
  setFormState,
  isLoading,
}: Readonly<TLocalizationStep>): JSX.Element {
  const { t } = useTranslation('new');
  const { t: tCommon } = useTranslation('common');
  const { t: tRegion } = useTranslation('region');
  const { t: tRegions } = useTranslation('regions');

  const [mappedRegions, setMappedRegions] = useState<TMappedRegion[]>([]);

  const [state, setState] = useState<{ selectedContinent: string }>({
    selectedContinent: undefined,
  });

  const getMacroRegion = (regionName: string) => {
    const localZonePattern = /^lz/i;
    let macro;
    if (
      localZonePattern.test(
        regionName
          .split('-')
          ?.slice(2)
          ?.join('-'),
      )
    ) {
      macro = /[\D]{2,3}/.exec(
        regionName
          .split('-')
          ?.slice(3)
          ?.join('-'),
      );
    } else {
      macro = /[\D]{2,3}/.exec(regionName);
    }
    return macro ? macro[0].replace('-', '').toUpperCase() : '';
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

      setMappedRegions(result);
    }
  }, [regions]);

  return (
    <StepComponent
      title={t('pci_projects_project_network_private_create_localisation')}
      next={
        isLoading
          ? undefined
          : {
              action: onNext,
              label: t('pci_projects_project_network_private_create_next'),
              isDisabled: mappedRegions.length === 0 || !formState.region,
            }
      }
      edit={{
        action: onEdit,
        label: tCommon('common_stepper_modify_this_step'),
        isDisabled: false,
      }}
      order={1}
      isOpen={isOpen}
      isChecked={isChecked}
    >
      <div className="my-8">
        {mappedRegions.length ? (
          <TilesInputComponent<TMappedRegion, string, string>
            value={formState.region}
            items={mappedRegions}
            label={(region: TMappedRegion) =>
              isRegionStandalone(region) ? (
                <RegionTile region={region} formState={formState} />
              ) : (
                region.name
              )
            }
            onInput={(region) => {
              setFormState({ ...formState, region });
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
                  formState={formState}
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
