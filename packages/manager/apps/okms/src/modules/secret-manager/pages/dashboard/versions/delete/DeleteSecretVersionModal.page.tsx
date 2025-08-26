import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNavigate, useParams } from 'react-router-dom';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { useUpdateSecretVersion } from '@secret-manager/data/hooks/useUpdateSecretVersion';
import { ConfirmationModal } from '@/common/components/confirmationModal/ConfirmationModal';

const DeleteSecretVersionModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['secret-manager/common', NAMESPACES.ACTIONS]);
  const { domainId, secretPath, versionId } = useParams() as {
    domainId: string;
    secretPath: string;
    versionId: string;
  };
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
        okmsId: domainId,
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
      title={t('secret-manager/common:delete_version_modal_title', {
        versionId,
      })}
      message={t('secret-manager/common:delete_version_modal_description')}
      onDismiss={handleDismiss}
      onConfirm={handleConfirm}
      confirmButtonLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      isConfirmButtonLoading={isPending}
      error={error?.response?.data?.message}
    />
  );
};

export default DeleteSecretVersionModal;
