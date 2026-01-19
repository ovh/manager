import { useNavigate } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret, SecretVersion } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';

import { ActionMenuItem } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

export type UseDeleteVersionParams = {
  id: number;
  okmsId: string;
  secret: Secret;
  version: SecretVersion;
};

export const useDeleteVersionItem = ({
  id,
  okmsId,
  secret,
  version,
}: UseDeleteVersionParams): ActionMenuItem | null => {
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { data: okms, isPending } = useOkmsById(okmsId);

  const handleDeleteVersion = () => {
    navigate(
      SECRET_MANAGER_ROUTES_URLS.versionListDeleteVersionModal(okmsId, secret.path, version.id),
    );
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['delete', 'version'],
    });
  };

  if (version.state === 'DEACTIVATED') {
    return {
      id,
      label: t('version_state_delete'),
      isDisabled: !isOkmsActive(okms),
      isLoading: isPending,
      color: ODS_BUTTON_COLOR.critical,
      onClick: handleDeleteVersion,
      urn: secret.iam.urn,
      iamActions: [kmsIamActions.secretVersionUpdate, kmsIamActions.secretVersionDelete],
    };
  }

  if (version.state === 'ACTIVE') {
    return {
      id,
      label: t('version_state_delete'),
      isDisabled: true,
      color: ODS_BUTTON_COLOR.critical,
    };
  }

  return null;
};
