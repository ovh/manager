import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ManagerTile } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { Link } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

type ActionsTileParams = {
  secret: Secret;
};

export const ActionsTile = ({ secret }: ActionsTileParams) => {
  const { okmsId } = useRequiredParams('okmsId');
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();

  return (
    <ManagerTile>
      <ManagerTile.Title>{t('actions')}</ManagerTile.Title>
      <ManagerTile.Divider />
      <div className="flex flex-col gap-2">
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretSecretValueDrawer(okmsId, secret.path)}
          label={t('reveal_secret')}
          isRouterLink
          onClick={() => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['reveal-secret'],
            });
          }}
        />
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretCreateVersionDrawer(
            okmsId,
            secret.path,
            secret.metadata.currentVersion,
          )}
          label={t('add_new_version')}
          isRouterLink
          onClick={() => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['add-version'],
            });
          }}
        />
        <Link
          href={SECRET_MANAGER_ROUTES_URLS.secretDeleteSecret(okmsId, secret.path)}
          label={t('delete_secret')}
          isRouterLink
          onClick={() => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['delete-secret'],
            });
          }}
        />
      </div>
    </ManagerTile>
  );
};
