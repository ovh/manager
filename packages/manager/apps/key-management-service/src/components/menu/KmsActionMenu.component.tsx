import { ActionMenu, ActionMenuItem } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React from 'react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OKMS } from '@/interface';
import { ROUTES_URLS } from '@/routes/routes.constants';

const KmsActionMenu: React.FC<OKMS> = ({ id }) => {
  const { t } = useTranslation('key-management-service/listing');
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('key_management_service_listing_terminate'),
      color: ODS_THEME_COLOR_INTENT.error,
      onClick: () => {
        navigate(`${ROUTES_URLS.terminateOkms}/${id}`);
      },
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

export default KmsActionMenu;
