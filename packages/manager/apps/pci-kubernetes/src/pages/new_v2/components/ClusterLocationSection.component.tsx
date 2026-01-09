import { type FC, useMemo } from 'react';

import { useWatch } from 'react-hook-form';
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
    id: 'GRA-A',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: true,
  },
  {
    id: 'GRA-B',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-C',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: [],
    disabled: true,
  },
  {
    id: 'GRA-D',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['standard'],
    disabled: false,
  },
  {
    id: 'GRA-E',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free'],
    disabled: false,
  },
  {
    id: 'GRA-F',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-G',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-H',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'UK',
    title: 'Londres',
    datacenter: 'UK',
    country: 'uk',
    microRegions: ['UK1'],
    plans: ['free', 'standard'],
    disabled: false,
  },
  {
    id: 'GRA-J',
    title: 'Gravelines',
    datacenter: 'GRA',
    country: 'fr',
    microRegions: ['GRA9', 'GRA11'],
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

  const selectedMacroRegion = useMemo(
    () => MOCK_regions.find(({ id }) => id === macroRegionField),
    [macroRegionField],
  );

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
                Todo : Récupérer liens et clés de trad <Icon name="external-link"></Icon>
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
            <MicroRegionSelect regions={MOCK_regions} />
          )}
        </>
      )}
    </>
  );
};
