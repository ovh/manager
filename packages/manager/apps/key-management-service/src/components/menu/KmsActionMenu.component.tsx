import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import React from 'react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OKMS } from '@/types/okms.type';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

const KmsActionMenu = ({ id }: OKMS) => {
  const { t } = useTranslation('key-management-service/listing');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('key_management_service_listing_terminate'),
      onClick: () => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: ['delete_kms'],
        });
        navigate(KMS_ROUTES_URLS.kmsListingTerminate(id));
      },
    },
  ];

  return (
    <ActionMenu
      id={`kmsActionMenu-${id}`}
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
};

export default KmsActionMenu;
