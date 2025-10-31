import React from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OKMS } from '@key-management-service/types/okms.type';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import useProductType, { ProductType } from '@/common/hooks/useProductType';

const useRenameLink = (okms: OKMS) => {
  const productType = useProductType();

  const renameLinks: Record<ProductType, string> = {
    'key-management-service': KMS_ROUTES_URLS.kmsEditName(okms.id),
    'secret-manager': SECRET_MANAGER_ROUTES_URLS.okmsUpdateNameModal(okms.id),
  };

  return renameLinks[productType];
};

type NameTileItemProps = {
  okms: OKMS;
};

export const NameTileItem = ({ okms }: NameTileItemProps) => {
  const { t } = useTranslation(NAMESPACES.DASHBOARD);
  const navigate = useNavigate();

  const renameLink = useRenameLink(okms);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>{t('display_name')}</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex justify-between items-center gap-2">
          <OdsText preset="span" className="break-all">
            {okms.iam.displayName}
          </OdsText>
          <div className="min-w-fit">
            <OdsButton
              aria-label="edit"
              size="sm"
              variant="ghost"
              color="primary"
              onClick={() => navigate(renameLink)}
              icon="pen"
              label=""
            />
          </div>
        </div>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
