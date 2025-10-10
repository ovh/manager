import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate, useParams } from 'react-router-dom';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useUpdateSecretVersion } from '@secret-manager/data/hooks/useUpdateSecretVersion';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { ConfirmationModal } from '@/common/components/confirmationModal/ConfirmationModal';

const DeleteSecretVersionModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager', NAMESPACES.ACTIONS]);
  const { okmsId, secretPath, versionId } = useParams<LocationPathParams>();

  const {
    mutateAsync: updateSecretVersion,
    isPending,
    error,
  } = useUpdateSecretVersion();

  const handleDismiss = () => {
    navigate('..');
  };

  const handleConfirm = async () => {
    try {
      await updateSecretVersion({
        okmsId,
        path: decodeSecretPath(secretPath),
        version: Number(versionId),
        state: 'DELETED',
      });
      handleDismiss();
    } catch {
      // Do nothing
    }
  };

  return (
    <ConfirmationModal
      title={t('delete_version_modal_title', {
        versionId,
      })}
      message={t('delete_version_modal_description')}
      onDismiss={handleDismiss}
      onConfirm={handleConfirm}
      confirmButtonLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      isConfirmButtonLoading={isPending}
      error={error?.response?.data?.message}
    />
  );
};

export default DeleteSecretVersionModal;
