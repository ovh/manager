import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
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
        <OdsText preset="paragraph" className="block">
          {t(
            'containers/enable-versioning:pci_projects_project_storages_containers_bucket_versioning_description',
          )}
        </OdsText>

        <div className="flex flex-col gap-4 my-6">
          <div className="flex items-center gap-4">
            <OdsRadio
              value="false"
              isChecked={!form.versioning || undefined}
              name="versioning"
              inputId="versioning-false"
              onOdsChange={() => setVersioning(false)}
            />
            <label htmlFor="versioning-false">
              <OdsText>
                {t(
                  'pci_projects_project_storages_containers_bucket_versioning_disabled',
                )}
              </OdsText>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <OdsRadio
              value="true"
              name="versioning"
              onOdsChange={() => setVersioning(true)}
              inputId="versioning-true"
              isChecked={form.versioning || undefined}
            />
            <label htmlFor="versioning-true">
              <OdsText>
                {t(
                  'pci_projects_project_storages_containers_bucket_versioning_enabled',
                )}
              </OdsText>
            </label>
          </div>
        </div>
      </>
    </StepComponent>
  );
}
