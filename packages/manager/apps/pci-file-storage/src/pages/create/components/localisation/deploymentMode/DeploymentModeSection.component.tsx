import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { DeploymentModeSelection } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeSelection.component';

export const DeploymentModeSection = () => {
  const { t } = useTranslation(['create']);

  return (
    <section className="my-8">
      <div className="mt-8 flex items-center gap-4">
        <Text preset="heading-4">{t('create:localisation.deploymentMode.title')}</Text>
      </div>
      <DeploymentModeSelection />
    </section>
  );
};
