import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { IHycuDetails } from '@/types/hycu.details.interface';
import { subRoutes, urls } from '@/routes/routes.constant';

const HycuActionMenu = ({ serviceName }: Pick<IHycuDetails, 'serviceName'>) => {
  const { t } = useTranslation('hycu/listing');
  const navigate = useNavigate();
  const openTerminateModal = () =>
    navigate(
      urls.listing_terminate.replace(subRoutes.serviceName, serviceName),
    );

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('hycu_service_listing_terminate'),
      color: ODS_THEME_COLOR_INTENT.error,
      onClick: openTerminateModal,
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
