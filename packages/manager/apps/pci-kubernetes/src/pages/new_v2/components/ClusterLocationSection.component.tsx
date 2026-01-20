import { type FC, useEffect, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { HelpDrawerDivider } from '@/components/helpDrawer/HelpDrawerDivider.component';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { MOCK_REGIONS } from '../mocks/regions.mock';
import { filterMacroRegions } from '../view-models/location.viewmodel';
import { ContinentSelect } from './location/ContinentSelect.component';
import { DeploymentModeSelect } from './location/DeploymentModeSelect.component';
import { MicroRegionSelect } from './location/MicroRegionSelect.component';
import { PlanSelect } from './location/PlanSelect.component';
import { RegionSelect } from './location/RegionSelect.component';

type TClusterLocationSectionProps = {
  is3azAvailable: boolean;
};

export const ClusterLocationSection: FC<TClusterLocationSectionProps> = ({ is3azAvailable }) => {
  const { t } = useTranslation('add');

  const { control } = useFormContext<TCreateClusterSchema>();
  const [macroRegionField, microRegionField, continentField, planField] = useWatch({
    control,
    name: ['location.macroRegion', 'location.microRegion', 'location.continent', 'location.plan'],
  });

  const { setValue } = useFormContext<TCreateClusterSchema>();

  const selectedMacroRegion = useMemo(
    () => MOCK_REGIONS.find(({ id }) => id === macroRegionField),
    [macroRegionField],
  );

  // Default Value Handler
  useEffect(() => {
    const firstMacroRegion = MOCK_REGIONS.find((region) => !region.disabled);
    const firstMicroRegion = firstMacroRegion?.microRegions.at(0);

    if (macroRegionField || microRegionField || !firstMacroRegion || !firstMicroRegion) return;

    setValue('location.macroRegion', firstMacroRegion.id);
    setValue('location.microRegion', firstMicroRegion);
  }, [macroRegionField, microRegionField, setValue]);

  const filteredRegions = useMemo(() => {
    return filterMacroRegions(continentField, planField)(MOCK_REGIONS);
  }, [continentField, planField]);

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
          <RegionSelect regions={filteredRegions} />
          {selectedMacroRegion?.microRegions && selectedMacroRegion?.microRegions.length > 1 && (
            <MicroRegionSelect regions={selectedMacroRegion?.microRegions} />
          )}
        </>
      )}
    </>
  );
};
