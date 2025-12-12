import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/muk';

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
      onOpenChange={() => onClose()}
      open={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: () => window.location.replace(upgradeCdnlUrl),
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: () => onClose(),
      }}
    >
      <Text>{t('cdn_shared_change_offer_modal_info')}</Text>
    </Modal>
  );
}
