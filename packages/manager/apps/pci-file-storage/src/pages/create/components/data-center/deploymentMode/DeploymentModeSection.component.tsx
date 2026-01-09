import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  DeploymentModeSelection
} from '@/pages/create/components/data-center/deploymentMode/DeploymentModeSelection.component';
import { memo } from 'react';

export const DeploymentModeSection = memo(() => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation', 'common']);

  return (
    <section className="my-8">
      <div className="mt-8 flex items-center gap-4">
        <Text preset="heading-4">
          {t('creation:pci_instance_creation_select_deployment_mode_title')}
        </Text>
      </div>
      <DeploymentModeSelection />
    </section>
  );
});
