import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export default function HostDelete() {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  return (
    <Modal
      isOpen={true}
      heading={t('domain_tab_hosts_modal_delete_title', {
        hostName: params.hostName,
      })}
      type={ODS_MODAL_COLOR.critical}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => navigate(-1)}
    >
      <div className="py-6">
        <Text preset={TEXT_PRESET.paragraph}>
          {t('domain_tab_hosts_modal_delete_information_message')}
        </Text>
      </div>
    </Modal>
  );
}
