import { PciCardShowcaseComponent } from '@/components/pciCard/PciCardShowcase.component';
import { QuantitySelector } from '@/pages/instances/create/components/QuantitySelector.component';
import { Text } from '@ovhcloud/ods-react';
import { FormProvider } from 'react-hook-form';
import { AdvancedParameters } from '../AdvancedParameters.component';
import { CreationCart } from '../CreationCart.component';
import { DeploymentModeSelection } from '../deploymentMode/DeploymentModeSelection.component';
import FlavorBlock from '../FlavorBlock.component';
import { LocalizationSelection } from '../localisationSelection/LocalizationSelection.component';
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
    macroRegion,
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
            <Text preset="paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. (Not
              mandatory) Si besoin d’un texte d’introduction... .
            </Text>
          </article>
          <Name />
          <Localization />
          <DeploymentModeSelection />
          <LocalizationSelection />
          {microRegions && hasMultiMicroRegions && (
            <div className="pt-7 pb-5">
              <MicroRegionSelection microRegions={microRegions} />
            </div>
          )}
          {!!availabilityZones.length && (
            <div className="pt-7 pb-5">
              <AvailabilityZoneSelection
                availabilityZones={availabilityZones}
              />
            </div>
          )}
          <FlavorBlock />
          <AdvancedParameters />
          <QuantitySelector
            quota={quantityHintParams.quota}
            type={quantityHintParams.type}
            region={quantityHintParams.region}
          />
          <PciCardShowcaseComponent />
        </section>
        <aside className="min-w-[280px] w-1/3 max-w-[640px]">
          <CreationCart />
        </aside>
      </div>
    </FormProvider>
  );
};
