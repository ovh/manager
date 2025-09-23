import { useContext, useMemo } from 'react';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { TileInputChoice } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { OdsLink, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import {
  DEPLOYMENT_MODE_LINK,
  ObjectContainerMode,
  STORAGE_PRICES_LINK,
} from '@/constants';

import { useColumnsCount } from '@/hooks/useColumnsCount';
import { DeploymentModeStepTile } from './DeploymentModeStepTile.component';
import { useContainerCreationStore } from '../useContainerCreationStore';
import { useStorageFeatures } from '@/hooks/useStorageFeatures';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';

export function DeploymentModeStep() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const { trackClick } = useOvhTracking();

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
  const {
    is3azAvailable,
    isLocalZoneAvailable,
    isPending,
  } = useStorageFeatures();

  const items = useMemo(
    () =>
      Object.values(ObjectContainerMode)
        .map((offer) => ({
          id: offer,
        }))
        .filter((item) => {
          if (
            item.id === ObjectContainerMode.LOCAL_ZONE &&
            !isLocalZoneAvailable
          ) {
            return false;
          }
          if (item.id === ObjectContainerMode.MULTI_ZONES && !is3azAvailable) {
            return false;
          }
          return true;
        }),
    [Object.values(ObjectContainerMode), is3azAvailable, isLocalZoneAvailable],
  );

  const trackDeploymentModeAction = (actionType, deploymentMode = null) => {
    const actions = [
      'funnel',
      'button',
      'add_objects_storage_container',
      actionType,
    ];

    if (deploymentMode) {
      actions.push(deploymentMode);
    }

    trackClick({ actions });
  };
  const hasStandardInfrequentAccess = UseStandardInfrequentAccessAvailability();

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
        action: () => {
          trackDeploymentModeAction(
            'select_deployment_mode',
            form.deploymentMode,
          );
          submitDeploymentMode();
        },
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !form.deploymentMode,
      }}
      edit={{
        action: () => {
          trackDeploymentModeAction(
            'edit_step_deployment_mode',
            form.deploymentMode,
          );
          editDeploymentMode();
        },
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      {!stepper.deployment.isLocked && (
        <OdsText preset="paragraph" className="mt-8 block">
          {t(
            'pci_projects_project_storages_containers_add_deployment_mode_sub_title',
          )}
          <OdsLink
            className="ml-4"
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

      {isPending && <OdsSpinner className="my-6" />}
      {!isPending && (
        <TileInputChoice
          items={items}
          columnsCount={columnsCount}
          selectedItem={items.find(({ id }) => id === form.deploymentMode)}
          onSelectItem={(item) => {
            trackDeploymentModeAction('select_deployment_mode', item.id);
            setDeploymentMode(item.id);
          }}
          isSubmitted={stepper.deployment.isLocked}
        >
          {(item, isSelected) => (
            <DeploymentModeStepTile
              item={item.id}
              isItemSelected={isSelected}
            />
          )}
        </TileInputChoice>
      )}

      {!stepper.deployment.isLocked && (
        <OdsText preset="caption" className="mt-8 block">
          {t(
            hasStandardInfrequentAccess
              ? 'pci_projects_project_storages_containers_add_deployment_mode_price_explanation_standard_infrequent_access'
              : 'pci_projects_project_storages_containers_add_deployment_mode_price_explanation',
          )}
          <OdsLink
            className="mt-4"
            color="primary"
            href={storagePricesLink}
            target="_blank"
            icon="external-link"
            label={t(
              hasStandardInfrequentAccess
                ? 'pci_projects_project_storages_containers_add_deployment_mode_price_explanation_link_standard_infrequent_access'
                : 'pci_projects_project_storages_containers_add_deployment_mode_price_explanation_link',
            )}
          />
        </OdsText>
      )}
    </StepComponent>
  );
}
