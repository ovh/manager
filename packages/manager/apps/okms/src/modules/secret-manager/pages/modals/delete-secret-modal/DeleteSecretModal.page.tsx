import { useNavigate } from 'react-router-dom';

import { useDeleteSecret } from '@secret-manager/data/hooks/useDeleteSecret';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { ConfirmationModal } from '@/common/components/confirmation-modal/ConfirmationModal';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

const DeleteSecretModal = () => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  const secretPathDecoded = decodeSecretPath(secretPath);

  const { mutateAsync: deleteSecret, isPending, error } = useDeleteSecret();

  const handleConfirm = async () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['delete', 'secret', 'confirm'],
    });
    try {
      await deleteSecret({
        okmsId,
        secretPath: secretPathDecoded,
      });
      navigate(SECRET_MANAGER_ROUTES_URLS.secretList(okmsId));
    } catch {
      // Do nothing
    }
  };

  const handleDismiss = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['delete', 'secret', 'cancel'],
    });
    navigate('..');
  };

  return (
    <ConfirmationModal
      title={t('delete_secret_modal_title')}
      message={t('delete_secret_modal_description', {
        secretPath: secretPathDecoded,
      })}
      onDismiss={handleDismiss}
      onConfirm={handleConfirm}
      confirmButtonLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      isConfirmButtonLoading={isPending}
      error={error?.response?.data?.message}
    />
  );
};

export default DeleteSecretModal;
