import { useNavigate } from 'react-router-dom';

import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { ActionMenuItemProps } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

export type UseRevealSecretParams = {
  id: number;
  okmsId: string;
  secret: Secret;
};

export const useAccessVersionMenuItem = ({
  id,
  okmsId,
  secret,
}: UseRevealSecretParams): ActionMenuItemProps => {
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();
  const navigate = useNavigate();

  const handleAccessVersion = () => {
    navigate(SECRET_MANAGER_ROUTES_URLS.versionList(okmsId, secret.path));
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['version', 'list'],
    });
  };

  return {
    id,
    label: t('access_versions'),
    onClick: handleAccessVersion,
  };
};
