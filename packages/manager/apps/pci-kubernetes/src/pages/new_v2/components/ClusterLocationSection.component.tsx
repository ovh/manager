import { type FC, useEffect, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { HelpDrawerDivider } from '@/components/helpDrawer/HelpDrawerDivider.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { ContinentSelect } from './location/ContinentSelect.component';
import { DeploymentModeSelect } from './location/DeploymentModeSelect.component';
import { MicroRegionSelect } from './location/MicroRegionSelect.component';
import { PlanSelect } from './location/PlanSelect.component';
import { RegionSelect } from './location/RegionSelect.component';

const MOCK_regions = [
  {
    id: 'GRA',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: true,
  },
  {
    id: 'SBG',
    title: 'Strasbourg',
    datacenter: 'SBG',
    country: 'fr',
    microRegions: ['SBG5', 'SBG7'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'BHS',
    title: 'Beauharnois',
    datacenter: 'BHS',
    country: 'ca',
    microRegions: ['BHS3', 'BHS5'],
    plans: [],
    disabled: true,
  },
  {
    id: 'WAW',
    title: 'Varsovie',
    datacenter: 'WAW',
    country: 'pl',
    microRegions: ['WAW1'],
    plans: ['standard'],
    disabled: false,
  },
  {
    id: 'DE',
    title: 'Francfort',
    datacenter: 'DE',
    country: 'de',
    microRegions: ['DE1', 'DE2'],
    plans: ['free'],
    disabled: false,
  },
  {
    id: 'UK',
    title: 'Londres',
    datacenter: 'UK',
    country: 'uk',
    microRegions: ['UK1', 'UK3'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'SGP',
    title: 'Singapour',
    datacenter: 'SGP',
    country: 'sg',
    microRegions: ['SGP1'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'SYD',
    title: 'Sydney',
    datacenter: 'SYD',
    country: 'au',
    microRegions: ['SYD1', 'SYD2'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'HIL',
    title: 'Hillsboro',
    datacenter: 'HIL',
    country: 'us',
    microRegions: ['HIL1'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'ES',
    title: 'Madrid',
    datacenter: 'ES',
    country: 'es',
    microRegions: ['ES1', 'ES2'],
    plans: ['free', 'standard'],
    disabled: false,
  },
];

type TClusterLocationSectionProps = {
  is3azAvailable: boolean;
};

export const ClusterLocationSection: FC<TClusterLocationSectionProps> = ({ is3azAvailable }) => {
  const { t } = useTranslation('add');

  const [macroRegionField, microRegionField] = useWatch<TCreateClusterSchema>({
    name: ['macroRegion', 'microRegion'],
  });
  const { setValue } = useFormContext<TCreateClusterSchema>();

  const selectedMacroRegion = useMemo(
    () => MOCK_regions.find(({ id }) => id === macroRegionField),
    [macroRegionField],
  );

  // Default Value Handler
  useEffect(() => {
    const firstMacroRegion = MOCK_regions.find((region) => !region.disabled);
    const firstMicroRegion = firstMacroRegion?.microRegions.at(0);

    if (macroRegionField || microRegionField || !firstMacroRegion || !firstMicroRegion) return;

    setValue('macroRegion', firstMacroRegion.id);
    setValue('microRegion', firstMicroRegion);
  }, [macroRegionField, microRegionField, setValue]);

  return (
    <>
      <Text preset="heading-3" className="mb-6">
        {t('kubernetes_add_location')}
      </Text>
      <Text preset="heading-4" className="mb-6 flex items-center">
        {t('kubernetes_add_location_subtitle')}
        <HelpDrawerDivider />
        <HelpDrawer></HelpDrawer>
      </Text>
      {is3azAvailable && (
        <>
          <Message dismissible={false}>
            <MessageIcon name="circle-info" />
            <MessageBody className="flex flex-col gap-4">
              TODO : Reprendre le contenu après la MEP du plan standard
              <Link href="https://ovhcloud.com" target="_blank">
                Todo : Récupérer liens et clés de trad après la MEP{' '}
                <Icon name="external-link"></Icon>
              </Link>
            </MessageBody>
          </Message>
          <DeploymentModeSelect />
          <div className="my-6 grid items-end gap-6 sm:grid-cols-2 lg:w-max">
            <ContinentSelect />
            <PlanSelect />
          </div>
          <RegionSelect regions={MOCK_regions} />
          {selectedMacroRegion?.microRegions && selectedMacroRegion?.microRegions.length > 1 && (
            <MicroRegionSelect regions={selectedMacroRegion?.microRegions} />
          )}
        </>
      )}
    </>
  );
};
