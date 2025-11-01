import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsLink, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { getOkmsPublicCa } from '@/data/api/okms';
import { initiateTextFileDownload } from '@/utils/dom/download';
import {
  PUBLIC_CA_FILENAME,
  PUBLIC_RSA_CA_FILENAME,
} from './downloadOkmsPublicCaLink.constants';
import { OKMS, OkmsPublicCa } from '@/types/okms.type';

export type CertificateType =
  | 'publicCaRest'
  | 'publicCaKmip'
  | 'publicCaRsaKmip';

type ButtonResource = {
  label: string;
  filename: string;
  certificateType: keyof OkmsPublicCa;
  tracking: string;
};

export type DownloadOkmsPublicCaLinkProps = {
  okms: OKMS;
  type: CertificateType;
};

export const DownloadOkmsPublicCaLink = ({
  okms,
  type,
}: DownloadOkmsPublicCaLinkProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const [loading, setLoading] = useState(false);
  const { addError } = useNotifications();
  const { trackClick } = useOvhTracking();

  const resources: Record<CertificateType, ButtonResource> = {
    publicCaRest: {
      label: t('key_management_service_dashboard_button_label_download_ca'),
      filename: PUBLIC_CA_FILENAME,
      certificateType: 'publicCA',
      tracking: 'download_rest-api-endpoint-ca',
    },
    publicCaKmip: {
      label: t('key_management_service_dashboard_button_label_download_ca'),
      filename: PUBLIC_CA_FILENAME,
      certificateType: 'publicCA',
      tracking: 'download_kmip-endpoint-ca',
    },
    publicCaRsaKmip: {
      label: t('key_management_service_dashboard_button_label_download_rsa_ca'),
      filename: PUBLIC_RSA_CA_FILENAME,
      certificateType: 'publicRsaCA',
      tracking: 'download_kmip-endpoint-ca-rsa',
    },
  };

  const handleDownloadCa = async (
    event: React.MouseEvent<HTMLOdsLinkElement, MouseEvent>,
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      const certificates = await getOkmsPublicCa(okms.id);

      initiateTextFileDownload({
        text: certificates[resources[type].certificateType],
        filename: resources[type].filename.replace('{region}', okms.region),
      });

      trackClick({
        location: PageLocation.tile,
        buttonType: ButtonType.link,
        actionType: 'action',
        actions: [resources[type].tracking],
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
        icon="download"
      />
      {loading && <OdsSpinner size="xs" />}
    </div>
  );
};
