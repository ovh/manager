import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { SlotItem } from './SlotsDatagrid.component';
import { usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { CANCEL_SLOT, CONFIGURE_SLOT } from '@/tracking.constants';

interface ActionButtonSlotProps {
  item: SlotItem;
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

  const hrefCancelSlot = useGenerateUrl(`./slots/${item.id}/cancel`, 'path');

  const handleCancelSlotClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [CANCEL_SLOT],
    });
    navigate(hrefCancelSlot);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleConfigureSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.slot.get],
      label: t('configure_account'),
    },
    {
      id: 2,
      onClick: handleCancelSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.slot.get],
      label: t('terminate'),
      color: ODS_BUTTON_COLOR.critical,
    },
  ];

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
