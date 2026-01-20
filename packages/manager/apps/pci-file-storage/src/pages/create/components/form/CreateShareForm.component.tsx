import { useWatch } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, Text } from '@ovhcloud/ods-react';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { DeploymentModeSection } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component';
import { MacroRegionSelection } from '@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component';
import { MicroRegionSelection } from '@/pages/create/components/localisation/microRegion/MicroRegionSelection.component';
import { NameInput } from '@/pages/create/components/name/NameInput.component';
import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';
import { selectMicroRegions } from '@/pages/create/view-model/shareCatalog.view-model';

export const CreateShareForm = () => {
  const { t } = useTranslation(['create']);

  const formMethods = useCreateShareForm();
  const macroRegion = useWatch({
    control: formMethods.control,
    name: 'macroRegion',
  });

  const { data: microRegionOptions } = useShareCatalog({
    select: selectMicroRegions(macroRegion),
  });

  const shouldShowMicroRegionSelection =
    microRegionOptions && microRegionOptions.length > 1;

  return (
    <FormProvider {...formMethods}>
      <div className="flex w-2/3 flex-col gap-6">
        <section>
          <Text preset="heading-2">{t('create:name.title')}</Text>
          <NameInput />
        </section>
        <Divider className="w-full" />
        <section>
          <Text preset="heading-2">{t('create:localisation.title')}</Text>
          <DeploymentModeSection />
          <MacroRegionSelection />
          {shouldShowMicroRegionSelection && <MicroRegionSelection />}
        </section>
      </div>
    </FormProvider>
  );
};
