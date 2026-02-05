import { Button } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useProject } from '@ovh-ux/manager-pci-common';
import { isDiscoveryProject } from '@/data/utils/project.utils';
import { BannerWithAction } from '@/components/banner/BannerWithAction.component';
import { useInstanceCreation } from './useInstanceCreation';
import { useProjectActivation } from './useProjectActivation';

type TCartActions = {
  cartActions: JSX.Element;
};

export const useCartActions = (): TCartActions => {
  const { t } = useTranslation(['creation']);
  const { data: project } = useProject();
  const { activateDiscoveryProject } = useProjectActivation();
  const {
    isCreationEnabled,
    isCreatingInstance,
    handleCreateInstance,
    errorMessage,
  } = useInstanceCreation();

  const cartActions = (
    <>
      {isDiscoveryProject(project) && (
        <BannerWithAction
          color="warning"
          titleKey={t('creation:pci_instance_creation_discovery_project_title')}
          message={t(
            'creation:pci_instance_creation_discovery_project_message',
          )}
          buttonLabel={t(
            'creation:pci_instance_creation_discovery_project_activate',
          )}
          onButtonClick={activateDiscoveryProject}
        />
      )}
      {errorMessage && (
        <BannerWithAction
          color="critical"
          titleKey={t('creation:pci_instance_creation_error_title')}
          message={errorMessage}
        />
      )}
      <Button
        loading={isCreatingInstance}
        onClick={handleCreateInstance}
        disabled={!isCreationEnabled}
      >
        {t('creation:pci_instance_creation_create_my_instance')}
      </Button>
      <Button variant="outline">
        {t('creation:pci_instance_creation_configuration_code')}
      </Button>
    </>
  );

  return { cartActions };
};
