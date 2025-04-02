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
} from './DownloadKmsPublicCaLink.constants';

export type CertificateType = 'publicCa' | 'publicRsaCa';

type DownloadCaButtonProps = {
  okmsId: string;
  type: CertificateType;
};

export const DownloadKmsPublicCaLink = ({
  okmsId,
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
    [t],
  );

  const handleDownloadCa = async (
    event: React.MouseEvent<HTMLOdsLinkElement, MouseEvent>,
  ) => {
    event.preventDefault();

    // Prevent multiple clicks
    if (loading) return;

    try {
      setLoading(true);
      const certificates = await getOkmsPublicCa(okmsId);
      setLoading(false);

      const content: Record<CertificateType, string> = {
        publicCa: certificates.publicCA,
        publicRsaCa: certificates.publicRsaCA,
      };

      initiateTextFileDownload({
        text: content[type],
        filename: resources[type].filename,
      });
    } catch (error) {
      setLoading(false);
      addError(t('key_management_service_dashboard_error_download_ca'));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <OdsLink
        href="#"
        color={ODS_BUTTON_COLOR.primary}
        onClick={handleDownloadCa}
        label={resources[type].label}
        data-testid={`download_kms_public_ca`}
      />
      {loading && <OdsSpinner size="xs" />}
    </div>
  );
};
