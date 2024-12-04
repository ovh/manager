import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContainerCreationStore } from '../useContainerCreationStore';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
} from '@/constants';

export function ContainerNameStep() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const {
    form,
    stepper,
    submitContainerName,
    editContainerName,
  } = useContainerCreationStore();
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
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editContainerName,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <span>TODO container name</span>
    </StepComponent>
  );
}
