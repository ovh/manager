import React, { useState } from 'react';

import { getOkmsPublicCa } from '@key-management-service/data/api/okms';
import { OKMS, OkmsPublicCa } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import { OdsLink, OdsSpinner } from '@ovhcloud/ods-components/react';

import { useNotifications } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { initiateTextFileDownload } from '@/common/utils/dom/download';
import { TrackingTags } from '@/tracking.constant';

import { PUBLIC_CA_FILENAME, PUBLIC_RSA_CA_FILENAME } from './downloadOkmsPublicCaLink.constants';

export type CertificateType = 'publicCaRest' | 'publicCaKmip' | 'publicCaRsaKmip';

type ButtonResource = {
  label: string;
  filename: string;
  certificateType: keyof OkmsPublicCa;
  tracking: TrackingTags[];
};

export type DownloadOkmsPublicCaLinkProps = {
  okms: OKMS;
  type: CertificateType;
};

export const DownloadOkmsPublicCaLink = ({ okms, type }: DownloadOkmsPublicCaLinkProps) => {
  const { t } = useTranslation('key-management-service/dashboard');
  const [loading, setLoading] = useState(false);
  const { addError } = useNotifications();
  const { trackClick } = useOkmsTracking();

  const resources: Record<CertificateType, ButtonResource> = {
    publicCaRest: {
      label: t('key_management_service_dashboard_button_label_download_ca'),
      filename: PUBLIC_CA_FILENAME,
      certificateType: 'publicCA',
      tracking: ['download', 'rest-api-endoint-ca'],
    },
    publicCaKmip: {
      label: t('key_management_service_dashboard_button_label_download_ca'),
      filename: PUBLIC_CA_FILENAME,
      certificateType: 'publicCA',
      tracking: ['download', 'kmip-api-endoint-ca'],
    },
    publicCaRsaKmip: {
      label: t('key_management_service_dashboard_button_label_download_rsa_ca'),
      filename: PUBLIC_RSA_CA_FILENAME,
      certificateType: 'publicRsaCA',
      tracking: ['download', 'kmip-api-endoint-ca-rsa'],
    },
  };

  const handleDownloadCa = async (event: React.MouseEvent<HTMLOdsLinkElement, MouseEvent>) => {
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
        actions: resources[type].tracking,
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
        onClick={(event) => void handleDownloadCa(event)}
        label={resources[type].label}
        isDisabled={loading}
        icon="download"
      />
      {loading && <OdsSpinner size="xs" />}
    </div>
  );
};
