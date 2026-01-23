import { useWatch } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, Text } from '@ovhcloud/ods-react';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { AvailabilityZoneSelection } from '@/pages/create/components/localisation/availabilityZone/AvailabilityZoneSelection.component';
import { DeploymentModeSection } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component';
import { MacroRegionSelection } from '@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component';
import { MicroRegionSelection } from '@/pages/create/components/localisation/microRegion/MicroRegionSelection.component';
import { NameInput } from '@/pages/create/components/name/NameInput.component';
import { ShareSelection } from '@/pages/create/components/share/ShareSelection.component';
import { ShareSizeSelection } from '@/pages/create/components/share/ShareSizeSelection.component';
import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';
import {
  selectAvailabilityZones,
  selectMicroRegions,
} from '@/pages/create/view-model/shareCatalog.view-model';

export const CreateShareForm = () => {
  const { t } = useTranslation(['create']);

  const formMethods = useCreateShareForm();
  const [selectedMacroRegion, selectedMicroRegion] = useWatch({
    control: formMethods.control,
    name: ['macroRegion', 'shareData.microRegion'],
  });

  const { data: microRegionOptions } = useShareCatalog({
    select: selectMicroRegions(selectedMacroRegion),
  });

  const { data: availabilityZones } = useShareCatalog({
    select: selectAvailabilityZones(selectedMicroRegion),
  });

  const shouldShowMicroRegionSelection = microRegionOptions && microRegionOptions.length > 1;
  const shouldShowAvailabilityZoneSelection = availabilityZones && availabilityZones.length > 0;

  return (
    <FormProvider {...formMethods}>
      <div className="flex w-2/3 flex-col gap-6">
        <section>
          <Text preset="heading-2">{t('create:name.title')}</Text>
          <NameInput />
        </section>
        <Divider className="w-full" />
        <section className="flex flex-col gap-6">
          <Text preset="heading-2">{t('create:localisation.title')}</Text>
          <DeploymentModeSection />
          <MacroRegionSelection />
          {shouldShowMicroRegionSelection && <MicroRegionSelection />}
          {shouldShowAvailabilityZoneSelection && <AvailabilityZoneSelection />}
        </section>
        <Divider className="w-full" />
        <section>
          <ShareSelection />
        </section>
        <Divider className="w-full" />
        <section>
          <ShareSizeSelection />
        </section>
      </div>
    </FormProvider>
  );
};
