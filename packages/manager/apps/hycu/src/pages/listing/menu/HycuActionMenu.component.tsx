import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React from 'react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { IHycuDetails } from '@/types/hycu.details.interface';

const HycuActionMenu = ({
  serviceName: _serviceName,
}: Pick<IHycuDetails, 'serviceName'>) => {
  const { t } = useTranslation('hycu/listing');

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('hycu_service_listing_terminate'),
      color: ODS_THEME_COLOR_INTENT.error,
      onClick: () => {},
    },
  ];

  return (
    <ActionMenu
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
    />
  );
};

export default HycuActionMenu;
