import { Suspense } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import CredentialCreationMethod from '@key-management-service/components/credential/credential-creation-method/credentialCreationMethod.component';
import { CredentialStatus } from '@key-management-service/components/credential/credential-status-badge/CredentialStatusBadge.component';
import { TileValueDate } from '@key-management-service/components/dashboard/tile-value-date/tileValueDate.component';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { getDownloadCredentialParameters } from '@key-management-service/utils/credential/credentialDownload';
import { useTranslation } from 'react-i18next';

import { Icon, Text } from '@ovhcloud/ods-react';

import { DashboardTile, DashboardTileBlockItem } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';
import { Clipboard } from '@ovh-ux/muk';

import { MukLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { useOutletCredential } from '../Credential.page';

const dateFormat: Intl.DateTimeFormatOptions = {
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const CredentialGeneralInformations = () => {
  const { okms, credential } = useOutletCredential();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/credential');
  const { trackClick } = useOkmsTracking();

  const { filename, href: downloadHref, isDisabled } = getDownloadCredentialParameters(credential);

  const items: DashboardTileBlockItem[] = [
    {
      id: 'name',
      label: t('key_management_service_credential_dashboard_name'),
      value: (
        <Text
          preset="span"
          // Temporary fix: wrap text without whitespace
          style={{ overflowWrap: 'anywhere' }}
        >
          {credential.name || credential.id}
        </Text>
      ),
    },
    {
      id: 'id',
      label: t('key_management_service_credential_dashboard_id'),
      value: <Clipboard className="w-full" value={credential.id} />,
    },
    {
      id: 'description',
      label: t('key_management_service_credential_dashboard_description'),
      value: (
        <Text
          preset="span"
          // Temporary fix: wrap text without whitespace
          style={{ overflowWrap: 'anywhere' }}
        >
          {credential.description || ''}
        </Text>
      ),
    },
    {
      id: 'status',
      label: t('key_management_service_credential_dashboard_status'),
      value: <CredentialStatus state={credential.status} />,
    },
    {
      id: 'type',
      label: t('key_management_service_credential_dashboard_type'),
      value: <Text preset="span">{credential.certificateType}</Text>,
    },
    {
      id: 'origin',
      label: t('key_management_service_credential_dashboard_origin'),
      value: <CredentialCreationMethod fromCSR={credential.fromCSR} />,
    },
    {
      id: 'creation',
      label: t('key_management_service_credential_dashboard_creation'),
      value: <TileValueDate value={credential.createdAt} options={dateFormat} />,
    },
    {
      id: 'expiration',
      label: t('key_management_service_credential_dashboard_expiration'),
      value: <TileValueDate value={credential.expiredAt} options={dateFormat} />,
    },
  ];

  items.push({
    id: 'actions',
    label: t('key_management_service_credential_dashboard_actions'),
    value: (
      <div className="flex items-center gap-4">
        {downloadHref && (
          <MukLink
            href={downloadHref}
            download={filename}
            disabled={isDisabled}
            onClick={() =>
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['download', 'credential'],
              })
            }
            label={t('key_management_service_credential_download')}
          >
            <>
              {t('key_management_service_credential_download')}
              <Icon name="download" />
            </>
          </MukLink>
        )}
        <Button
          id="deleteAccessCertificate"
          size="sm"
          color="critical"
          variant="ghost"
          iamActions={[kmsIamActions.credentialDelete]}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['delete', 'credential'],
            });
            navigate(KMS_ROUTES_URIS.credentialDelete);
          }}
          urn={okms.iam.urn}
        >
          {t('key_management_service_credential_delete')}
        </Button>
      </div>
    ),
  });

  return (
    <div className="grid grid-cols-1 gap-4 break-words md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      <DashboardTile
        title={t('key_management_service_credential_dashboard_tile_general_informations')}
        items={items}
      />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default CredentialGeneralInformations;
