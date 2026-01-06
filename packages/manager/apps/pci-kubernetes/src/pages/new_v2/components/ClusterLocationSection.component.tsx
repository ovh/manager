import { type FC, useContext, useEffect, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { HelpDrawerDivider } from '@/components/helpDrawer/HelpDrawerDivider.component';
import { PLAN_DOC_LINKS } from '@/constants';
import { TClusterPlanEnum } from '@/types';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { selectAvailableContinentOptions } from '../view-models/continents.viewmodel';
import { selectAvailablePlanOptions } from '../view-models/plans.viewmodel';
import {
  filterMacroRegions,
  findDefaultMacroRegion,
  findDefaultMicroRegion,
  mapMacroRegionForCards,
  useCombinedRegions,
} from '../view-models/regions.viewmodel';
import { ClusterLocationHelpDrawer } from './location/ClusterLocationHelpDrawer.component';
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

  const continentOptions = useMemo(
    () => selectAvailableContinentOptions(planField)(regions),
    [planField, regions],
  );

  const planOptions = useMemo(
    () => selectAvailablePlanOptions(continentField)(regions),
    [continentField, regions],
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
    setValue('location.plan', TClusterPlanEnum.ALL);
  };

  useEffect(() => {
    const isCurrentMacroRegionDisplayed = cardRegions?.find(({ id }) => id === macroRegionField);

    if (isCurrentMacroRegionDisplayed) return;

    setValue('location.macroRegion', null);
    setValue('location.microRegion', null);
  }, [cardRegions, macroRegionField, setValue]);

  // Default Value Handler
  useEffect(() => {
    if (macroRegionField || microRegionField) return;

    const defaultMacroRegion = findDefaultMacroRegion(
      is3azAvailable,
      deploymentModeField,
    )(cardRegions);
    const defaultMicroRegion = findDefaultMicroRegion(
      is3azAvailable,
      deploymentModeField,
    )(defaultMacroRegion?.microRegions);
    if (!defaultMacroRegion || !defaultMicroRegion) return;

    setValue('location.macroRegion', defaultMacroRegion.id);
    setValue('location.microRegion', defaultMicroRegion);
  }, [
    macroRegionField,
    microRegionField,
    cardRegions,
    setValue,
    is3azAvailable,
    deploymentModeField,
  ]);

  const planDocumentationLink =
    PLAN_DOC_LINKS[ovhSubsidiary as keyof typeof PLAN_DOC_LINKS] ?? PLAN_DOC_LINKS.DEFAULT;

  return (
    <>
      <Text preset="heading-3" className="mb-6">
        {t('kubernetes_add_location')}
      </Text>
      {is3azAvailable && (
        <>
          <Text preset="heading-4" className="mb-6 flex items-center">
            {t('kubernetes_add_location_subtitle')}
            <HelpDrawerDivider />
            <ClusterLocationHelpDrawer />
          </Text>

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
          <div className="mb-9 mt-6 grid items-end gap-6 sm:grid-cols-2 lg:w-max">
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
