import { useContext, useMemo } from 'react';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { TileInputChoice } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { OBJECT_CONTAINER_OFFERS, STORAGE_PRICES_LINK } from '@/constants';

import { useColumnsCount } from '@/hooks/useColumnsCount';
import { SolutionStepTileComponent } from './SolutionStepTile.component';
import { useContainerCreationStore } from '../useContainerCreationStore';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';

export function SolutionStepComponent() {
  const { t } = useTranslation(['containers/add', 'pci-common']);
  const { trackClick } = useOvhTracking();
  const columnsCount = useColumnsCount();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const storagePricesLink =
    STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;
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

  const hasStandardInfrequentAccess = UseStandardInfrequentAccessAvailability();

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
            hasStandardInfrequentAccess={hasStandardInfrequentAccess}
          />
        )}
      </TileInputChoice>

      {hasStandardInfrequentAccess && (
        <OdsText preset="caption" className="mt-8 block">
          {t(
            'pci_projects_project_storages_containers_add_offers_estimated_price_explanation',
          )}
          <OdsLink
            className="mt-4"
            color="primary"
            href={storagePricesLink}
            target="_blank"
            icon="external-link"
            label={t(
              'pci_projects_project_storages_containers_add_offers_estimated_price_explanation_link',
            )}
          />
        </OdsText>
      )}
    </StepComponent>
  );
}
