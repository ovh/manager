import { useNavigate } from 'react-router-dom';

import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret, SecretVersion } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

export type UseRevealValueParams = {
  id: number;
  okmsId: string;
  secret: Secret;
  version: SecretVersion;
};

export const useRevealValueMenuItem = ({
  id,
  okmsId,
  secret,
  version,
}: UseRevealValueParams): ActionMenuItem | null => {
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();
  const navigate = useNavigate();

  const handleRevealVersionValue = () => {
    navigate(
      SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(okmsId, secret.path, version.id),
    );
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['reveal', 'version'],
    });
  };

  if (version.state === 'ACTIVE') {
    return {
      id,
      label: t('reveal_secret'),
      onClick: handleRevealVersionValue,
      urn: secret.iam.urn,
      iamActions: [kmsIamActions.secretGet, kmsIamActions.secretVersionGetData],
    };
  }

  if (version.state === 'DEACTIVATED') {
    return {
      id,
      label: t('reveal_secret'),
      isDisabled: true,
    };
  }

  return null;
};
