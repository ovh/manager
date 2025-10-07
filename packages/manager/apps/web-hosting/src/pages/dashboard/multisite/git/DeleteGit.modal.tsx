import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Modal } from '@ovh-ux/manager-react-components';

export default function DeleteGitModal() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const onClose = () => {
    navigate(-1);
  };
  return <Modal heading={t('delete_git')} onDismiss={onClose} isOpen></Modal>;
}
