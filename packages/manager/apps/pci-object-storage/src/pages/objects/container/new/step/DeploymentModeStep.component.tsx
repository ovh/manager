import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { TileInputChoice } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import {
  DEPLOYMENT_MODE_LINK,
  OBJECT_CONTAINER_DEPLOYMENT_MODES,
  STORAGE_PRICES_LINK,
} from '@/constants';

import { useColumnsCount } from '@/hooks/useColumnsCount';
import { DeploymentModeStepTile } from './DeploymentModeStepTile.component';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function DeploymentModeStep() {
  const { t } = useTranslation(['containers/add', 'pci-common']);

  const columnsCount = useColumnsCount();
  const {
    form,
    stepper,
    setDeploymentMode,
    editDeploymentMode,
    submitDeploymentMode,
  } = useContainerCreationStore();

  const context = useContext(ShellContext);

  const { ovhSubsidiary } = context.environment.getUser();
  const deploymentModeLink =
    DEPLOYMENT_MODE_LINK[ovhSubsidiary] || DEPLOYMENT_MODE_LINK.DEFAULT;
  const storagePricesLink =
    STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;

  const items = useMemo(
    () =>
      OBJECT_CONTAINER_DEPLOYMENT_MODES.map((offer) => ({
        id: offer,
      })),
    [OBJECT_CONTAINER_DEPLOYMENT_MODES],
  );

  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_deployment_mode_title',
      )}
      isOpen={stepper.deployment.isOpen || stepper.deployment.isLocked}
      isChecked={stepper.deployment.isChecked}
      isLocked={stepper.deployment.isLocked}
      order={2}
      next={{
        action: submitDeploymentMode,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !form.deploymentMode,
      }}
      edit={{
        action: editDeploymentMode,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      {!stepper.deployment.isLocked && (
        <OdsText preset="paragraph" className="mt-8 block">
          {t(
            'pci_projects_project_storages_containers_add_deployment_mode_sub_title',
          )}
          <OdsLink
            className="mt-4"
            color="primary"
            href={deploymentModeLink}
            target="_blank"
            label={t(
              'pci_projects_project_storages_containers_add_deployment_mode_sub_title_link',
            )}
            icon="external-link"
          />
        </OdsText>
      )}

      <TileInputChoice
        items={items}
        columnsCount={columnsCount}
        selectedItem={items.find(({ id }) => id === form.deploymentMode)}
        onSelectItem={(item) => setDeploymentMode(item.id)}
        isSubmitted={stepper.deployment.isLocked}
      >
        {(item, isSelected) => (
          <DeploymentModeStepTile item={item.id} isItemSelected={isSelected} />
        )}
      </TileInputChoice>

      {!stepper.deployment.isLocked && (
        <OdsText preset="paragraph" className="mt-8 block">
          {t(
            'pci_projects_project_storages_containers_add_deployment_mode_price_explanation',
          )}
          <OdsLink
            className="mt-4"
            color="primary"
            href={storagePricesLink}
            target="_blank"
            icon="external-link"
            label={t(
              'pci_projects_project_storages_containers_add_deployment_mode_price_explanation_link',
            )}
          />
        </OdsText>
      )}
    </StepComponent>
  );
}
