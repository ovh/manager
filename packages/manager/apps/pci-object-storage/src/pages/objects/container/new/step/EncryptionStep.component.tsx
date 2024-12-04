import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function EncryptionStep() {
  const { t } = useTranslation(['containers/data-encryption', 'pci-common']);
  const {
    stepper,
    submitEncryption,
    editEncryption,
  } = useContainerCreationStore();
  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_data_encryption_title',
      )}
      isOpen={stepper.encryption.isOpen || stepper.encryption.isLocked}
      isChecked={stepper.encryption.isChecked}
      isLocked={stepper.encryption.isLocked}
      order={6}
      next={{
        action: submitEncryption,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editEncryption,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <span>TODO encryption</span>
    </StepComponent>
  );
}
