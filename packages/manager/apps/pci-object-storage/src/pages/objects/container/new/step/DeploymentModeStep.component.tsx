import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { TileInputChoice } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
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
        isDisabled: false,
      }}
      edit={{
        action: editDeploymentMode,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      {!stepper.deployment.isLocked && (
        <p>
          <span>
            {t(
              'pci_projects_project_storages_containers_add_deployment_mode_sub_title',
            )}{' '}
          </span>
          <OsdsLink
            className="mt-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={deploymentModeLink}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {t(
              'pci_projects_project_storages_containers_add_deployment_mode_sub_title_link',
            )}
            <span slot="end">
              <OsdsIcon
                aria-hidden="true"
                className="ml-4"
                name={ODS_ICON_NAME.EXTERNAL_LINK}
                hoverable
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </span>
          </OsdsLink>
        </p>
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
        <p>
          <span>
            {t(
              'pci_projects_project_storages_containers_add_deployment_mode_price_explanation',
            )}
          </span>
          <OsdsLink
            className="mt-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={storagePricesLink}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {t(
              'pci_projects_project_storages_containers_add_deployment_mode_price_explanation_link',
            )}
            <span slot="end">
              <OsdsIcon
                aria-hidden="true"
                className="ml-4"
                name={ODS_ICON_NAME.EXTERNAL_LINK}
                hoverable
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
            </span>
          </OsdsLink>
        </p>
      )}
    </StepComponent>
  );
}
