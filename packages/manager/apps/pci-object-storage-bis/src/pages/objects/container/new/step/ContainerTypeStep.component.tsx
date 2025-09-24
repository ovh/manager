import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { TileInputChoice } from '@ovh-ux/manager-pci-common';

import { OBJECT_CONTAINER_TYPES } from '@/constants';
import { useColumnsCount } from '@/hooks/useColumnsCount';
import { ContainerTypeTile } from './ContainerTypeTile.component';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function ContainerType() {
  const { t } = useTranslation(['containers/add', 'pci-common']);

  const columnsCount = useColumnsCount();

  const {
    form,
    stepper,
    submitContainerType,
    setContainerType,
    editContainerType,
  } = useContainerCreationStore();

  const items = OBJECT_CONTAINER_TYPES.map((type) => ({
    id: type,
  }));

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
        isDisabled: !form.containerType,
      }}
      edit={{
        action: editContainerType,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <TileInputChoice
        items={items}
        columnsCount={columnsCount}
        selectedItem={items.find(({ id }) => id === form.containerType)}
        onSelectItem={(item) => setContainerType(item.id)}
        isSubmitted={stepper.containerType.isLocked}
      >
        {(item, isSelected) => (
          <ContainerTypeTile type={item.id} isSelected={isSelected} />
        )}
      </TileInputChoice>
    </StepComponent>
  );
}
