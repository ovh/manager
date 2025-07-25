import {
  ActionMenu,
  ActionMenuItem,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
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

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('terminate'),
      color: ODS_THEME_COLOR_INTENT.error,
      onClick: () => {
        trackClick(
          TRACKING.listing.deleteClick(serviceDetails?.data.billing.plan.code),
        );
        openTerminateModal();
      },
      disabled:
        serviceDetails?.data.resource.state === 'suspended' || undefined,
    },
  ];

  return (
    <ActionMenu
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
    />
  );
};

export default HycuActionMenu;
