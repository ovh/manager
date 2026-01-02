import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_VARIANT } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, ActionMenuProps } from '@ovh-ux/muk';

import { ServiceBillingState } from '@/data/api';
import { SlotWithService, usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import {
  CANCEL_SLOT,
  CONFIGURE_SLOT,
  UNDO_CANCEL_SLOT,
  UPDATE_OFFER_SLOT,
} from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

interface ActionButtonSlotProps {
  item: SlotWithService;
}

export const ActionButtonSlot: React.FC<ActionButtonSlotProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();

  const hrefConfigureSlot = useGenerateUrl('./add', 'path', {
    slotId: item.id,
  });

  const handleConfigureSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [CONFIGURE_SLOT],
    });
    navigate(hrefConfigureSlot);
  };

  const hrefCancelSlot = useGenerateUrl(`./slot/${item.id}/cancel`, 'path');

  const handleCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [CANCEL_SLOT],
    });
    navigate(hrefCancelSlot);
  };

  const hrefUndoCancelSlot = useGenerateUrl(`./slot/${item.id}/undo_cancel`, 'path');

  const handleUndoCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UNDO_CANCEL_SLOT],
    });
    navigate(hrefUndoCancelSlot);
  };

  const hrefUpgradeEmailAccount = useGenerateUrl(`./slot/${item?.id}/update_offer`, 'path');

  const handleUpdateOfferSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UPDATE_OFFER_SLOT],
    });
    navigate(hrefUpgradeEmailAccount);
  };

  const actionItems: ActionMenuProps['items'] = [
    {
      id: 1,
      onClick: handleConfigureSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.slot.get],
      label: t('configure_account'),
    },
    {
      id: 2,
      onClick: handleUpdateOfferSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.slot.get],
      label: t('update_offer'),
    },
  ];

  if (item?.service?.state === ServiceBillingState.AUTOMATIC_RENEWAL) {
    actionItems.push({
      id: actionItems.length + 1,
      onClick: handleCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t(`${NAMESPACES.ACTIONS}:terminate`),
      color: BUTTON_COLOR.critical,
    });
  }

  if (item?.service?.state === ServiceBillingState.CANCELATION_PLANNED) {
    actionItems.push({
      id: actionItems.length + 1,
      onClick: handleUndoCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('undo_cancel_slot'),
      color: BUTTON_COLOR.critical,
    });
  }

  return <ActionMenu id={item.id} items={actionItems} variant={BUTTON_VARIANT.ghost} isCompact />;
};

export default ActionButtonSlot;
