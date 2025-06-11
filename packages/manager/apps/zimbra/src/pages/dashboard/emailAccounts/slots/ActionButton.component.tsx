import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { SlotWithService, usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { CONFIGURE_SLOT, UPGRADE_SLOT } from '@/tracking.constants';
import { FEATURE_AVAILABILITY } from '@/contants';

interface ActionButtonSlotProps {
  item: SlotWithService;
}

export const ActionButtonSlot: React.FC<ActionButtonSlotProps> = ({ item }) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('common');
  const { platformUrn } = usePlatform();
  const navigate = useNavigate();
  const { data: availability } = useFeatureAvailability([
    FEATURE_AVAILABILITY.PRO_BETA,
  ]);

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

  const hrefUpgradeEmailAccount = useGenerateUrl(
    `./${item?.id}/upgrade`,
    'path',
  );

  const handleUpgradeEmailClick = () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [UPGRADE_SLOT],
    });
    navigate(hrefUpgradeEmailAccount);
  };

  const actionItems = [
    {
      id: 1,
      onClick: handleConfigureSlotClick,
      urn: platformUrn,
      iamActions: [IAM_ACTIONS.slot.get],
      label: t('configure_account'),
    },
    ...(availability?.[FEATURE_AVAILABILITY.PRO_BETA]
      ? [
          {
            id: 2,
            onClick: handleUpgradeEmailClick,
            urn: platformUrn,
            iamActions: [IAM_ACTIONS.slot.get],
            label: t('upgrade_pro'),
          },
        ]
      : []),
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
