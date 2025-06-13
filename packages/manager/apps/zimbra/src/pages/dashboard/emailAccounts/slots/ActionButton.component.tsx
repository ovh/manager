import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { SlotWithService, usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import {
  CANCEL_SLOT,
  CONFIGURE_SLOT,
  UNDO_CANCEL_SLOT,
} from '@/tracking.constants';
import { ServiceBillingState } from '@/data/api';

interface ActionButtonSlotProps {
  item: SlotWithService;
}

export const ActionButtonSlot: React.FC<ActionButtonSlotProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('common');
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

  const hrefUndoCancelSlot = useGenerateUrl(
    `./slot/${item.id}/undo_cancel`,
    'path',
  );

  const handleUndoCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UNDO_CANCEL_SLOT],
    });
    navigate(hrefUndoCancelSlot);
  };

  const actionItems: ActionMenuItem[] = [
    {
      id: 1,
      onClick: handleConfigureSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.slot.get],
      label: t('configure_account'),
    },
  ];

  if (item?.service?.state === ServiceBillingState.AUTOMATIC_RENEWAL) {
    actionItems.push({
      id: actionItems.length + 1,
      onClick: handleCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('terminate'),
      color: ODS_BUTTON_COLOR.critical,
    });
  }

  if (item?.service?.state === ServiceBillingState.CANCELATION_PLANNED) {
    actionItems.push({
      id: actionItems.length + 1,
      onClick: handleUndoCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.account.edit],
      label: t('undo_cancel_slot'),
      color: ODS_BUTTON_COLOR.critical,
    });
  }

  return (
    <ActionMenu
      id={item.id}
      items={actionItems}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};

export default ActionButtonSlot;
