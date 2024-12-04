import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function ContainerType() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const {
    stepper,
    submitContainerType,
    editContainerType,
  } = useContainerCreationStore();
  return (
    <StepComponent
      title={t('pci_projects_project_storages_containers_add_type_title')}
      isOpen={stepper.containerType.isOpen || stepper.containerType.isLocked}
      isChecked={stepper.containerType.isChecked}
      isLocked={stepper.containerType.isLocked}
      order={3}
      next={{
        action: submitContainerType,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editContainerType,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <span>TODO container type</span>
    </StepComponent>
  );
}
