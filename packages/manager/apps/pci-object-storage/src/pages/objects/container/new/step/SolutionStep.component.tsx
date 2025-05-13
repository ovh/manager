import { useMemo } from 'react';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { TileInputChoice } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { OBJECT_CONTAINER_OFFERS } from '@/constants';

import { useColumnsCount } from '@/hooks/useColumnsCount';
import { SolutionStepTileComponent } from './SolutionStepTile.component';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function SolutionStepComponent() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const columnsCount = useColumnsCount();
  const {
    form,
    stepper,
    setOffer,
    editOffer,
    submitOffer,
  } = useContainerCreationStore();
  const items = useMemo(
    () =>
      OBJECT_CONTAINER_OFFERS.map((offer) => ({
        id: offer,
      })),
    [OBJECT_CONTAINER_OFFERS],
  );
  return (
    <StepComponent
      title={t('pci_projects_project_storages_containers_add_offer_title')}
      isOpen={stepper.offer.isOpen || stepper.offer.isLocked}
      isChecked={stepper.offer.isChecked}
      isLocked={stepper.offer.isLocked}
      order={1}
      next={{
        action: submitOffer,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !form.offer,
      }}
      edit={{
        action: editOffer,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <TileInputChoice
        items={items}
        columnsCount={columnsCount}
        selectedItem={items.find(({ id }) => id === form.offer)}
        onSelectItem={(item) => setOffer(item.id)}
        isSubmitted={stepper.offer.isLocked}
      >
        {(item, isSelected) => (
          <SolutionStepTileComponent
            item={item.id}
            isItemSelected={isSelected}
          />
        )}
      </TileInputChoice>
    </StepComponent>
  );
}
