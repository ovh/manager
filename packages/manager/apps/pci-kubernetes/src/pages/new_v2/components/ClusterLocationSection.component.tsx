import { type FC, useContext, useEffect, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Icon, Link, Message, MessageBody, MessageIcon, Text } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { useKubeRegions } from '@/api/hooks/useKubeRegions';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { HelpDrawerDivider } from '@/components/helpDrawer/HelpDrawerDivider.component';
import { PLAN_DOC_LINKS } from '@/constants';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';
import { filterAndMapRegions } from '../view-models/location.viewmodel';
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

  const { data: kubeRegions } = useKubeRegions();

  const { data: regions } = useAvailabilityRegions({
    select: filterAndMapRegions(continentField, planField, deploymentModeField, kubeRegions),
  });

  const selectedMacroRegion = useMemo(
    () => regions?.find(({ id }) => id === macroRegionField),
    [macroRegionField, regions],
  );

  // Default Value Handler
  useEffect(() => {
    const firstMacroRegion = regions?.find((region) => !region.disabled);
    const firstMicroRegion = firstMacroRegion?.microRegions.at(0);

    if (macroRegionField || microRegionField || !firstMacroRegion || !firstMicroRegion) return;

    setValue('location.macroRegion', firstMacroRegion.id);
    setValue('location.microRegion', firstMicroRegion);
  }, [macroRegionField, microRegionField, regions, setValue]);

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
          <DeploymentModeSelect />
          <div className="my-6 grid items-end gap-6 sm:grid-cols-2 lg:w-max">
            <ContinentSelect />
            <PlanSelect />
          </div>
        </>
      )}
      <RegionSelect regions={regions} />
      {selectedMacroRegion?.microRegions && selectedMacroRegion?.microRegions.length > 1 && (
        <MicroRegionSelect regions={selectedMacroRegion?.microRegions} />
      )}
    </>
  );
};
