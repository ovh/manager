import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { getIpExport } from '@/data/api';
import useDownload from '@/data/hooks/useDownload';

export default function ExportIpsModal() {
  const { t } = useTranslation(['ips', NAMESPACES.ACTIONS, 'error']);
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { trackPage } = useOvhTracking();
  const { download } = useDownload();
  const navigate = useNavigate();

  const close = () => navigate('..');

  const onExport = useCallback(async () => {
    try {
      const ips: string = await getIpExport();
      download(ips, 'ips.csv');
      clearNotifications();
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'ip-export_success',
      });
      addSuccess(t('export_ips_success'));
    } catch (err) {
      clearNotifications();
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'ip-export_error',
      });
      addError(t('export_ips_error', { error: err?.message }), true);
    } finally {
      close();
    }
  }, []);

  return (
    <Modal
      isOpen={true}
      onDismiss={close}
      heading={t('export_ips_header')}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={onExport}
      secondaryLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={close}
    >
      <div>
        <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
          {t('export_ips_description')}
        </OdsText>
        <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
          {t('export_ips_confirmation')}
        </OdsText>
      </div>
    </Modal>
  );
}
