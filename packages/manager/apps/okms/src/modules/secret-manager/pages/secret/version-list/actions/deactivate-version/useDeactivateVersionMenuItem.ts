import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { useUpdateSecretVersion } from '@secret-manager/data/hooks/useUpdateSecretVersion';
import { Secret, SecretVersion } from '@secret-manager/types/secret.type';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { ActionMenuItemProps } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

export type UseDeactivateVersionParams = {
  id: number;
  okmsId: string;
  secret: Secret;
  version: SecretVersion;
};

export const useDeactivateVersionItem = ({
  id,
  okmsId,
  secret,
  version,
}: UseDeactivateVersionParams): ActionMenuItemProps | null => {
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();
  const { addError } = useNotifications();
  const { data: okms, isPending: isOkmsPending } = useOkmsById(okmsId);

  const { mutateAsync: updateSecretVersion, isPending: isUpdateSecretVersionPending } =
    useUpdateSecretVersion();

  const isPending = isOkmsPending || isUpdateSecretVersionPending;

  const handleDeactivateVersion = async () => {
    trackClick({
      location: PageLocation.datagrid,
      buttonType: ButtonType.link,
      actionType: 'action',
      actions: ['deactivate', 'version'],
    });
    try {
      await updateSecretVersion({
        okmsId,
        path: decodeSecretPath(secret.path),
        version: version.id,
        state: 'DEACTIVATED',
      });
    } catch (error) {
      const apiError = error as ApiError;
      addError(apiError?.response?.data?.message);
    }
  };

  if (version.state === 'ACTIVE') {
    return {
      id,
      label: t('version_state_deactivate'),
      isDisabled: !isOkmsActive(okms),
      isLoading: isPending,
      onClick: () => handleDeactivateVersion(),
      urn: secret.iam.urn,
      iamActions: [kmsIamActions.secretVersionUpdate, kmsIamActions.secretVersionDeactivate],
    };
  }

  return null;
};
