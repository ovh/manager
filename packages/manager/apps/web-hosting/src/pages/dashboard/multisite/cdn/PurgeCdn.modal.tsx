import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Modal } from '@ovh-ux/manager-react-components';

export default function PurgeCdnModal() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };
  return <Modal heading={t('purge_cdn')} onDismiss={onClose} isOpen></Modal>;
}
