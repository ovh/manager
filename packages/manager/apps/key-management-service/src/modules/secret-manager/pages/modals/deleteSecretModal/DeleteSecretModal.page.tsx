import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate, useParams } from 'react-router-dom';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useDeleteSecret } from '@secret-manager/data/hooks/useDeleteSecret';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { ConfirmationModal } from '@/common/components/confirmationModal/ConfirmationModal';

const DeleteSecretModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager/common', NAMESPACES.ACTIONS]);
  const { domainId, secretPath } = useParams<LocationPathParams>();

  const secretPathDecoded = decodeSecretPath(secretPath);

  const { mutateAsync: deleteSecret, isPending, error } = useDeleteSecret();

  const handleConfirm = async () => {
    try {
      await deleteSecret({
        okmsId: domainId,
        secretPath: secretPathDecoded,
      });
      navigate(SECRET_MANAGER_ROUTES_URLS.secretListing(domainId));
    } catch {
      // Do nothing
    }
  };

  return (
    <ConfirmationModal
      title={t('secret-manager/common:delete_secret_modal_title')}
      message={t('secret-manager/common:delete_secret_modal_description', {
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
