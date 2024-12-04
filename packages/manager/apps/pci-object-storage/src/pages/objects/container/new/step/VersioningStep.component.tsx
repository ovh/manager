import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function VersioningStep() {
  const { t } = useTranslation(['containers/bucket-versioning', 'pci-common']);
  const {
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
      <span>TODO versioning</span>
    </StepComponent>
  );
}
