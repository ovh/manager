import {
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContext, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContainerCreationStore } from '../useContainerCreationStore';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  STORAGE_ASYNC_REPLICATION_LINK,
} from '@/constants';

const validNameRegex = /^[a-z0-9]([a-z0-9.-]{1,61})[a-z0-9]$/;

export function ContainerNameStep() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const {
    form,
    stepper,
    setContainerName,
    submitContainerName,
    editContainerName,
  } = useContainerCreationStore();
  const [isTouched, setIsTouched] = useState(false);
  const isValid = validNameRegex.test(form.containerName);
  const shouldDisplayError = isTouched && !isValid;
  const asyncReplicationLink =
    STORAGE_ASYNC_REPLICATION_LINK[ovhSubsidiary] ||
    STORAGE_ASYNC_REPLICATION_LINK.DEFAULT;

  return (
    <StepComponent
      title={t('pci_projects_project_storages_containers_add_name_title')}
      isOpen={stepper.containerName.isOpen || stepper.containerName.isLocked}
      isChecked={stepper.containerName.isChecked}
      isLocked={stepper.containerName.isLocked}
      order={
        form.offer === OBJECT_CONTAINER_OFFER_SWIFT ||
        (form.offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD &&
          form.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE)
          ? 4
          : 7
      }
      next={{
        action: submitContainerName,
        label: t('pci_projects_project_storages_containers_add_submit_label'),
        isDisabled: !isValid,
      }}
      edit={{
        action: editContainerName,
        label: t('pci_projects_project_storages_containers_add_cancel_label'),
      }}
    >
      <OsdsFormField
        error={
          shouldDisplayError
            ? t('pci-common:common_field_error_pattern')
            : undefined
        }
      >
        <OsdsInput
          value={form.containerName}
          onOdsInputBlur={() => setIsTouched(true)}
          onOdsValueChange={(event) => setContainerName(event.detail.value)}
          type={ODS_INPUT_TYPE.text}
          color={ODS_THEME_COLOR_INTENT.primary}
          inline
        />
      </OsdsFormField>
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={
          shouldDisplayError
            ? ODS_THEME_COLOR_INTENT.error
            : ODS_THEME_COLOR_INTENT.text
        }
      >
        {t(
          'pci_projects_project_storages_containers_add_pattern_help_storage-s3',
        )}
      </OsdsText>
      {(form.deploymentMode === OBJECT_CONTAINER_MODE_MONO_ZONE ||
        form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES) && (
        <OsdsMessage
          className="mt-4"
          type={ODS_MESSAGE_TYPE.info}
          color={ODS_THEME_COLOR_INTENT.info}
        >
          <p>
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t(
                'pci_projects_project_storages_containers_add_replication_rules_info',
              )}
            </OsdsText>
            <OsdsLink
              color={ODS_THEME_COLOR_INTENT.primary}
              href={asyncReplicationLink}
              target={OdsHTMLAnchorElementTarget._blank}
            >
              {t(
                'pci_projects_project_storages_containers_add_replication_rules_info_link',
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
        </OsdsMessage>
      )}
    </StepComponent>
  );
}
