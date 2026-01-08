import { useNavigate } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { ActionMenuItemProps } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

export type UseAddVersionParams = {
  id: number;
  okmsId: string;
  secret: Secret;
};

export const useAddVersionMenuItem = ({
  id,
  okmsId,
  secret,
}: UseAddVersionParams): ActionMenuItemProps => {
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();
  const navigate = useNavigate();

  const { data: okms, isPending } = useOkmsById(okmsId);

  const handleAddVersion = () => {
    navigate(
      SECRET_MANAGER_ROUTES_URLS.secretListCreateVersionDrawer(
        okmsId,
        secret.path,
        secret.metadata.currentVersion,
      ),
    );
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['create', 'version'],
    });
  };

  return {
    id,
    label: t('add_new_version'),
    onClick: handleAddVersion,
    urn: secret.iam.urn,
    iamActions: [kmsIamActions.secretVersionCreate],
    isDisabled: !isOkmsActive(okms),
    isLoading: isPending,
  };
};
