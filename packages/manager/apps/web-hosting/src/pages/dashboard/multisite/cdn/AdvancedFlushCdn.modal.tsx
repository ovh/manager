import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import { useHostingUrl } from '@/hooks';

export default function AdvancedFlushCdnModal() {
  const { serviceName } = useParams();
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const upgradeCdnlUrl = useHostingUrl(serviceName, 'cdn/upgrade');

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      heading={t('cdn_shared_option_advanced_flush_title')}
      onDismiss={onClose}
      isOpen
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={onClose}
      onPrimaryButtonClick={() => window.location.replace(upgradeCdnlUrl)}
    >
      <OdsText>{t('cdn_shared_change_offer_modal_info')}</OdsText>
    </Modal>
  );
}
