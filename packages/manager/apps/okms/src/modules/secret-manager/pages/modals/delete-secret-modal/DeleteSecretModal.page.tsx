import { useNavigate } from 'react-router-dom';

import { useDeleteSecret } from '@secret-manager/data/hooks/useDeleteSecret';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ConfirmationModal } from '@/common/components/confirmation-modal/ConfirmationModal';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

const DeleteSecretModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const { okmsId, secretPath } = useRequiredParams('okmsId', 'secretPath');

  const secretPathDecoded = decodeSecretPath(secretPath);

  const { mutateAsync: deleteSecret, isPending, error } = useDeleteSecret();

  const handleConfirm = async () => {
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

  return (
    <ConfirmationModal
      title={t('delete_secret_modal_title')}
      message={t('delete_secret_modal_description', {
        secretPath: secretPathDecoded,
      })}
      onDismiss={() => navigate('..')}
      onConfirm={handleConfirm}
      confirmButtonLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      isConfirmButtonLoading={isPending}
      error={error?.response?.data?.message}
    />
  );
};

export default DeleteSecretModal;
