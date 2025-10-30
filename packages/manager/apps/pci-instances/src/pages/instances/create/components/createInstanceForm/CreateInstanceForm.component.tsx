import { PciCardShowcaseComponent } from '@/components/pciCard/PciCardShowcase.component';
import { QuantitySelector } from '@/pages/instances/create/components/QuantitySelector.component';
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

const quantityHintParams = {
  quota: 1,
  type: 'type',
  region: 'region',
};

export const CreateInstanceForm = () => {
  const { t } = useTranslation(['common', 'creation']);

  const projectId = useProjectId();
  const formMethods = useForm(projectId);
  const macroRegion = formMethods.watch('macroRegion');
  const microRegions = selectMicroRegions(deps)(projectId, macroRegion);
  const availabilityZones = selectAvailabilityZones(deps)(
    projectId,
    microRegions?.[0]?.value ?? null,
  );

  const hasMultiMicroRegions = microRegions ? microRegions.length > 1 : false;
  return (
    <FormProvider {...formMethods}>
      <div className="flex gap-6">
        <section className="w-2/3">
          <article className="mb-9">
            <Text preset="heading-1">
              {t('common:pci_instances_common_create_instance')}
            </Text>
            <Text className="mt-4" preset="paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. (Not
              mandatory) Si besoin d’un texte d’introduction... .
            </Text>
          </article>
          <Name />
          <Divider spacing="64" />
          <QuantitySelector
            quota={quantityHintParams.quota}
            type={quantityHintParams.type}
            region={quantityHintParams.region}
          />
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
          <DistributionImage />
          <AdvancedParameters />
          <PciCardShowcaseComponent />
        </section>
        <aside className="min-w-[280px] w-1/3 max-w-[640px]">
          <CreationCart />
        </aside>
      </div>
    </FormProvider>
  );
};
