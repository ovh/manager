import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsLink, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { getOkmsPublicCa } from '@/data/api/okms';
import { initiateTextFileDownload } from '@/utils/dom/download';
import {
  PUBLIC_CA_FILENAME,
  PUBLIC_RSA_CA_FILENAME,
} from './downloadKmsPublicCaLink.constants';
import { OKMS } from '@/types/okms.type';

export type CertificateType = 'publicCa' | 'publicRsaCa';

type DownloadCaButtonProps = {
  okms: OKMS;
  type: CertificateType;
};

export const DownloadKmsPublicCaLink = ({
  okms,
  type,
}: DownloadCaButtonProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const [loading, setLoading] = useState(false);
  const { addError } = useNotifications();

  const resources = useMemo(
    () => ({
      publicCa: {
        label: t('key_management_service_dashboard_button_label_download_ca'),
        filename: PUBLIC_CA_FILENAME,
      },
      publicRsaCa: {
        label: t(
          'key_management_service_dashboard_button_label_download_rsa_ca',
        ),
        filename: PUBLIC_RSA_CA_FILENAME,
      },
    }),
    [],
  );

  const handleDownloadCa = async (
    event: React.MouseEvent<HTMLOdsLinkElement, MouseEvent>,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      const certificates = await getOkmsPublicCa(okms.id);

      const content: Record<CertificateType, string> = {
        publicCa: certificates.publicCA,
        publicRsaCa: certificates.publicRsaCA,
      };

      initiateTextFileDownload({
        text: content[type],
        filename: resources[type].filename.replace('{region}', okms.region),
      });
    } catch {
      addError(t('key_management_service_dashboard_error_download_ca'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <OdsLink
        href="#"
        color={ODS_BUTTON_COLOR.primary}
        onClick={handleDownloadCa}
        label={resources[type].label}
        isDisabled={loading}
      />
      {loading && <OdsSpinner size="xs" />}
    </div>
  );
};
