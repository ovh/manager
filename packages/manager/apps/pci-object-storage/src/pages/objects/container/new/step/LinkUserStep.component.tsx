import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function LinkUserStep() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const { stepper, editUser, submitUser } = useContainerCreationStore();
  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_add_create_or_linked_user_title',
      )}
      isOpen={stepper.user.isOpen || stepper.user.isLocked}
      isChecked={stepper.user.isChecked}
      isLocked={stepper.user.isLocked}
      order={4}
      next={{
        action: submitUser,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editUser,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <span>TODO container name</span>
    </StepComponent>
  );
}
