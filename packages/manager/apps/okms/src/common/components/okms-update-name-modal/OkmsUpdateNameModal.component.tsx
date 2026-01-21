import { useNavigate } from 'react-router-dom';

import { useUpdateOkmsName } from '@key-management-service/data/hooks/useUpdateOkmsName';
import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { UpdateNameModal } from '@ovh-ux/muk';

type OkmsUpdateNameModalProps = {
  okms: OKMS;
};

const OkmsUpdateNameModal = ({ okms }: OkmsUpdateNameModalProps) => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const {
    updateOkmsName,
    isPending,
    error: updateError,
  } = useUpdateOkmsName({
    okms,
    onSuccess: () => {
      navigate('..');
    },
  });

  const handleUpdateDisplayName = (newDisplayName: string) => {
    updateOkmsName({ displayName: newDisplayName });
  };

  return (
    <UpdateNameModal
      isOpen
      headline={t('modify_name', { ns: NAMESPACES.ACTIONS })}
      inputLabel={t('display_name', { ns: NAMESPACES.DASHBOARD })}
      defaultValue={okms.iam.displayName}
      isLoading={isPending}
      error={updateError?.message}
      onClose={() => navigate('..')}
      updateDisplayName={handleUpdateDisplayName}
    />
  );
};

export default OkmsUpdateNameModal;
