import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { Link } from '@/common/components/link/Link.component';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

type ActionsTileParams = {
  secret: Secret;
};

export const ActionsTile = ({ secret }: ActionsTileParams) => {
  const { okmsId } = useRequiredParams('okmsId');
  const { t } = useTranslation('secret-manager');

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('actions')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <div className="flex flex-col gap-2">
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretSecretValueDrawer(okmsId, secret.path)}
          label={t('reveal_secret')}
          isRouterLink
        />
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretCreateVersionDrawer(okmsId, secret.path)}
          label={t('add_new_version')}
          isRouterLink
        />
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretDeleteSecret(okmsId, secret.path)}
          label={t('delete_secret')}
          isRouterLink
        />
      </div>
    </ManagerTile>
  );
};
