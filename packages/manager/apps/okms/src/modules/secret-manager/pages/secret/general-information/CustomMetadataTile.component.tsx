import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { KeyValueTagsList } from '@/common/components/key-value-tags-list/KeyValueTagsList.component';
import { Link } from '@/common/components/link/Link.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

type CustomMetadataTileProps = {
  secret: Secret;
};

export const CustomMetadataTile = ({ secret }: CustomMetadataTileProps) => {
  const { t } = useTranslation('secret-manager');
  const { okmsId } = useRequiredParams('okmsId');

  const customMetadata = secret.metadata.customMetadata;

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('metadata')}</ManagerTile.Title>
      <ManagerTile.Divider />
      {customMetadata && (
        <>
          <ManagerTile.Item>
            <KeyValueTagsList tags={customMetadata} />
          </ManagerTile.Item>
          <ManagerTile.Divider />
        </>
      )}
      <ManagerTile.Item>
        <ManagerTile.Item.Description>
          <Link
            href={SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(okmsId, secret.path)}
            label={customMetadata ? t('edit_custom_metadata') : t('add_custom_metadata')}
            isRouterLink
          />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};
