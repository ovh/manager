import { useMemo } from 'react';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { TileInputChoice } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OBJECT_CONTAINER_OFFERS } from '@/constants';

import { useColumnsCount } from '@/hooks/useColumnsCount';
import { SolutionStepTileComponent } from './SolutionStepTile.component';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function SolutionStepComponent() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const { trackClick } = useOvhTracking();
  const columnsCount = useColumnsCount();
  const {
    form,
    stepper,
    setOffer,
    editOffer,
    submitOffer,
  } = useContainerCreationStore();

  const trackOfferAction = (actionType, offer = form.offer) => {
    trackClick({
      actions: [
        'funnel',
        'button',
        'add_objects_storage_container',
        actionType,
        ...(offer ? [offer] : []),
      ],
    });
  };

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
        action: () => {
          trackOfferAction('select_offer');
          submitOffer();
        },
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !form.offer,
      }}
      edit={{
        action: () => {
          trackOfferAction('edit_step_offer');
          editOffer();
        },
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <TileInputChoice
        items={items}
        columnsCount={columnsCount}
        selectedItem={items.find(({ id }) => id === form.offer)}
        onSelectItem={(item) => {
          trackOfferAction('select_offer', item.id);
          setOffer(item.id);
        }}
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
