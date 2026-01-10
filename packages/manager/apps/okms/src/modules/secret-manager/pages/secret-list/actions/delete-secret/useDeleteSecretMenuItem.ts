import { useNavigate } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

export type UseDeleteSecretParams = {
  id: number;
  okmsId: string;
  secret: Secret;
};

export const useDeleteSecretMenuItem = ({
  id,
  okmsId,
  secret,
}: UseDeleteSecretParams): ActionMenuItem => {
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();
  const navigate = useNavigate();

  const { data: okms, isPending } = useOkmsById(okmsId);

  const handleDeleteSecret = () => {
    navigate(SECRET_MANAGER_ROUTES_URLS.secretListDeleteSecretModal(okmsId, secret.path));
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['delete', 'secret'],
    });
  };

  return {
    id,
    label: t('delete_secret'),
    onClick: handleDeleteSecret,
    urn: secret.iam.urn,
    iamActions: [kmsIamActions.secretDelete],
    isDisabled: !isOkmsActive(okms),
    isLoading: isPending,
  };
};
