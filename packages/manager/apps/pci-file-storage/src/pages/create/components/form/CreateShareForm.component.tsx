import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, Text } from '@ovhcloud/ods-react';

import { DeploymentModeSection } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component';
import { MacroRegionSelection } from '@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component';
import { NameInput } from '@/pages/create/components/name/NameInput.component';
import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';

export const CreateShareForm = () => {
  const { t } = useTranslation(['create']);

  const formMethods = useCreateShareForm();

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
        </section>
      </div>
    </FormProvider>
  );
};
