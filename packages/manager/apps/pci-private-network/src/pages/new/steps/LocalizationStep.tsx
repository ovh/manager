import {
  StepComponent,
  TileInputComponent,
} from '@ovhcloud/manager-components';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  const regionLabel = (region: TMappedRegion) => {
    const stackedRegions = mappedRegions.filter(
      ({ name }) => name === region.name,
    ).length;
    return stackedRegions === 1 ? <RegionTile region={region} /> : region.code;
  };

  const groupLabel = (groupedRegions: TMappedRegion[]) =>
    groupedRegions.length === mappedRegions.length
      ? tRegions('pci_project_regions_list_continent_all')
      : groupedRegions[0]?.continent;

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

  useEffect(() => {
    if (regions?.length > 0) {
      const result = regions.map((region) => ({
        name: getTranslatedMacroRegion(region),
        code: region.name,
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
      next={{
        action: isLoading ? undefined : onNext,
        label: t('pci_projects_project_network_private_create_next'),
        isDisabled: mappedRegions.length === 0 || !formState.region,
      }}
      edit={{
        action: onEdit,
        label: tCommon('common_stepper_modify_this_step'),
      }}
      order={1}
      isOpen={isOpen}
      isChecked={isChecked}
    >
      <div className="my-8">
        {mappedRegions.length ? (
          <TileInputComponent
            value={formState.region}
            items={mappedRegions}
            label={(region: TMappedRegion) => regionLabel(region)}
            onInput={(region) => {
              setFormState({ ...formState, region });
            }}
            group={{
              by: (region: TMappedRegion) => region.continent,
              label: (groupedRegions: TMappedRegion[]) =>
                groupLabel(groupedRegions),
              showAllTab: true,
            }}
            stack={{
              by: (region: TMappedRegion) => region.name,
              label: (stackedRegion: TMappedRegion) => (
                <RegionTile region={stackedRegion} type="stack" />
              ),
              title: tRegions('pci_project_regions_list_region'),
            }}
          />
        ) : (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
        )}
      </div>
    </StepComponent>
  );
}
