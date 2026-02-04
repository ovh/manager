import { Divider, Text } from '@ovhcloud/ods-react';
import { FormProvider } from 'react-hook-form';
import { AdvancedParameters } from '../AdvancedParameters.component';
import { CreationCart } from '../CreationCart.component';
import { DeploymentModeSection } from '../deploymentMode/DeploymentModeSection.component';
import FlavorBlock from '../FlavorBlock.component';
import { Localization } from '../Localization.component';
import { MicroRegionSelection } from '../microRegionSelection/MicroRegionSelection.component';
import { Name } from '../Name.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useForm } from '../../hooks/useForm';
import { selectMicroRegions } from '../../view-models/microRegionsViewModel';
import { deps } from '@/deps/deps';
import { useTranslation } from 'react-i18next';
import { selectAvailabilityZones } from '../../view-models/availabilityZonesViewModel';
import { AvailabilityZoneSelection } from '../availabilityZoneSelection/AvailabilityZoneSelection.component';
import { LocalizationSelection } from '../localisationSelection/LocalizationSelection.component';
import DistributionImage from '../DistributionImage.component';
import SshKey from '../SshKey.component';
import Network from '../Network.component';
import BillingChoice from '../BillingChoice.component';
import { selectBillingTypes } from '../../view-models/BillingTypesViewModel';
import { useMemo } from 'react';
import Backup from '../Backup.component';
import PostInstallScript from '../PostInstallScript.component';

export const CreateInstanceForm = () => {
  const { t } = useTranslation(['common', 'creation']);

  const projectId = useProjectId();
  const formMethods = useForm(projectId);
  const macroRegion = formMethods.watch('macroRegion');
  const microRegion = formMethods.watch('microRegion');
  const [osType, distributionImageType, flavorId] = formMethods.watch([
    'distributionImageOsType',
    'distributionImageType',
    'flavorId',
  ]);
  const microRegions = selectMicroRegions(deps)(projectId, macroRegion);
  const availabilityZones = selectAvailabilityZones(deps)(
    projectId,
    microRegions?.[0]?.value ?? null,
  );

  const isWindowsSelected =
    osType === 'windows' || distributionImageType === 'windows';

  const hasMultiMicroRegions = microRegions ? microRegions.length > 1 : false;

  const billingTypes = useMemo(
    () => selectBillingTypes(deps)(projectId, flavorId, osType),
    [projectId, flavorId, osType],
  );

  return (
    <FormProvider {...formMethods}>
      <div className="flex gap-6">
        <section className="w-2/3">
          <article className="mb-9">
            <Text preset="heading-1">
              {t('common:pci_instances_common_create_instance')}
            </Text>
          </article>
          <Name />
          <Divider spacing="64" />
          <Localization />
          <DeploymentModeSection />
          <LocalizationSelection />
          {microRegions && hasMultiMicroRegions && (
            <MicroRegionSelection microRegions={microRegions} />
          )}
          {!!availabilityZones.length && (
            <AvailabilityZoneSelection availabilityZones={availabilityZones} />
          )}
          <Divider spacing="64" />
          <FlavorBlock />
          {microRegion && <DistributionImage microRegion={microRegion} />}
          {!isWindowsSelected && <SshKey />}
          {microRegion && <Backup microRegion={microRegion} />}
          <Divider spacing="64" />
          <Network />
          {billingTypes.length > 1 && (
            <BillingChoice billingTypes={billingTypes} />
          )}
          <AdvancedParameters />
          <PostInstallScript />
        </section>
        <aside className="w-1/3 min-w-[280px] max-w-[640px]">
          <CreationCart />
        </aside>
      </div>
    </FormProvider>
  );
};
