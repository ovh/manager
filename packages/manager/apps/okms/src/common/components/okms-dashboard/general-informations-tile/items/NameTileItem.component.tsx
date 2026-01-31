import { useNavigate } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Icon, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button, Tile } from '@ovh-ux/muk';

import { ProductType, useProductType } from '@/common/hooks/useProductType';

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
    <Tile.Item.Root>
      <Tile.Item.Term label={t('display_name')} />
      <Tile.Item.Description>
        <div className="flex items-center justify-between gap-2">
          <Text preset="span" className="break-all">
            {okms.iam.displayName}
          </Text>
          <div className="min-w-fit">
            <Button
              aria-label="edit"
              size="sm"
              variant="ghost"
              color="primary"
              onClick={() => navigate(renameLink)}
            >
              <Icon name="pen" />
            </Button>
          </div>
        </div>
      </Tile.Item.Description>
    </Tile.Item.Root>
  );
};
