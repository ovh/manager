import { type FC, useContext, useEffect, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { HelpDrawerDivider } from '@/components/helpDrawer/HelpDrawerDivider.component';
import { PLAN_DOC_LINKS } from '@/constants';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { selectAvailableContinentOptions } from '../view-models/continents.viewmodel';
import { selectAvailablePlanOptions } from '../view-models/plans.viewmodel';
import {
  filterMacroRegions,
  mapMacroRegionForCards,
  useCombinedRegions,
} from '../view-models/regions.viewmodel';
import { ContinentSelect } from './location/ContinentSelect.component';
import { DeploymentModeSelect } from './location/DeploymentModeSelect.component';
import { MicroRegionSelect } from './location/MicroRegionSelect.component';
import { PlanSelect } from './location/PlanSelect.component';
import { RegionSelect } from './location/RegionSelect.component';

type TClusterLocationSectionProps = {
  is3azAvailable: boolean;
};

export const ClusterLocationSection: FC<TClusterLocationSectionProps> = ({ is3azAvailable }) => {
  const { t } = useTranslation(['add', 'region-selector']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const { control } = useFormContext<TCreateClusterSchema>();
  const [macroRegionField, microRegionField, continentField, planField, deploymentModeField] =
    useWatch({
      control,
      name: [
        'location.macroRegion',
        'location.microRegion',
        'location.continent',
        'location.plan',
        'location.deploymentMode',
      ],
    });

  const { setValue } = useFormContext<TCreateClusterSchema>();

  const { regions } = useCombinedRegions(deploymentModeField);

  const { continents: continentOptions, plans: planOptions } = useMemo(
    () => ({
      continents: selectAvailableContinentOptions(regions),
      plans: selectAvailablePlanOptions(regions),
    }),
    [regions],
  );

  const cardRegions = useMemo(
    () => mapMacroRegionForCards(filterMacroRegions(continentField, planField)(regions)),
    [regions, continentField, planField],
  );

  const selectedMacroRegion = useMemo(
    () => cardRegions?.find(({ id }) => id === macroRegionField),
    [macroRegionField, cardRegions],
  );

  const onDeploymentModeChange = (value: TCreateClusterSchema['location']['deploymentMode']) => {
    if (value === deploymentModeField) return;

    setValue('location.continent', 'ALL');
    setValue('location.plan', 'all');

    // Will retrigger the default values handler
    setValue('location.macroRegion', null);
    setValue('location.microRegion', null);
  };

  // Default Value Handler
  useEffect(() => {
    if (macroRegionField || microRegionField) return;

    const firstMacroRegion = cardRegions?.at(0);
    const firstMicroRegion = firstMacroRegion?.microRegions.at(0);
    if (!firstMacroRegion || !firstMicroRegion) return;

    setValue('location.macroRegion', firstMacroRegion.id);
    setValue('location.microRegion', firstMicroRegion);
  }, [macroRegionField, microRegionField, cardRegions, setValue]);

  const planDocumentationLink =
    PLAN_DOC_LINKS[ovhSubsidiary as keyof typeof PLAN_DOC_LINKS] ?? PLAN_DOC_LINKS.DEFAULT;

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
              {t('region-selector:pci_projects_project_regions_filter_plan_message')}
              <Link href={planDocumentationLink} target={OdsHTMLAnchorElementTarget._blank}>
                {t('region-selector:pci_projects_project_regions_filter_plan_compare')}
                <Icon name="external-link"></Icon>
              </Link>
            </MessageBody>
          </Message>
          <DeploymentModeSelect onDeploymentModeChange={onDeploymentModeChange} />
          <div className="my-6 grid items-end gap-6 sm:grid-cols-2 lg:w-max">
            <ContinentSelect options={continentOptions ?? []} />
            <PlanSelect options={planOptions} />
          </div>
        </>
      )}
      <RegionSelect regions={cardRegions} />
      {selectedMacroRegion?.microRegions && selectedMacroRegion?.microRegions.length > 1 && (
        <MicroRegionSelect regions={selectedMacroRegion?.microRegions} />
      )}
    </>
  );
};
