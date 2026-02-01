import { ICON_NAME } from '@ovhcloud/ods-react';
import {
  ActionMenu,
  ActionMenuItemProps,
  BUTTON_COLOR,
  BUTTON_VARIANT,
} from '@ovh-ux/muk';
import { useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { IHycuDetails } from '@/types/hycu.details.interface';
import { subRoutes, urls } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constant';

const HycuActionMenu = ({ serviceName }: Pick<IHycuDetails, 'serviceName'>) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const openTerminateModal = () =>
    navigate(
      urls.listing_terminate.replace(subRoutes.serviceName, serviceName),
    );
  const { data: serviceDetails } = useServiceDetails({
    resourceName: serviceName,
  });

  const items: ActionMenuItemProps[] = [
    {
      id: 1,
      label: t('terminate'),
      onClick: () => {
        trackClick(
          TRACKING.listing.deleteClick(serviceDetails?.data.billing.plan.code),
        );
        openTerminateModal();
      },
      color: BUTTON_COLOR.critical,
      isDisabled:
        serviceDetails?.data.resource.state === 'suspended' || undefined,
    },
  ];

  return (
    <ActionMenu
      id="hycu-listing-action-menu"
      items={items}
      isCompact
      variant={BUTTON_VARIANT.ghost}
      icon={ICON_NAME.ellipsisVertical}
    />
  );
};

export default HycuActionMenu;
