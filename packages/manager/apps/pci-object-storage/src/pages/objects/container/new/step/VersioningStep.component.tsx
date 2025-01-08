import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function VersioningStep() {
  const { t } = useTranslation([
    'containers/bucket-versioning',
    'containers/enable-versioning',
    'pci-common',
  ]);
  const {
    form,
    setVersioning,
    stepper,
    submitVersioning,
    editVersioning,
  } = useContainerCreationStore();
  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_bucket_versioning_title',
      )}
      isOpen={stepper.versioning.isOpen || stepper.versioning.isLocked}
      isChecked={stepper.versioning.isChecked}
      isLocked={stepper.versioning.isLocked}
      order={5}
      next={{
        action: submitVersioning,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editVersioning,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <>
        <p>
          <OdsText preset="paragraph">
            {t(
              'containers/enable-versioning:pci_projects_project_storages_containers_bucket_versioning_description',
            )}
          </OdsText>
        </p>
        <div className="flex mt-4">
          <OdsRadio
            className="mr-4"
            value="false"
            isChecked={!form.versioning || undefined}
            name="versioning"
            inputId="versioning-false"
            onOdsChange={() => setVersioning(false)}
          />
          <label htmlFor="versioning-false">
            {t(
              'pci_projects_project_storages_containers_bucket_versioning_disabled',
            )}
          </label>
        </div>
        <div className="flex mt-4">
          <OdsRadio
            className="mr-4"
            value="true"
            name="versioning"
            onOdsChange={() => setVersioning(true)}
            inputId="versioning-true"
            isChecked={form.versioning || undefined}
          />
          <label htmlFor="versioning-true">
            {t(
              'pci_projects_project_storages_containers_bucket_versioning_enabled',
            )}
          </label>
        </div>
      </>
    </StepComponent>
  );
}
