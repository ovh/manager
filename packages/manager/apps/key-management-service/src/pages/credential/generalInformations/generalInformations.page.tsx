import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_COLOR,
  ODS_LINK_COLOR,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  Clipboard,
  DashboardTile,
  DashboardTileBlockItem,
  ManagerButton,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { CredentialStatus } from '@/components/credential/credentialStatus/CredentialStatus.component';
import { TileValueDate } from '@/components/dashboard/tile-value-date/tileValueDate.component';
import CredentialCreationMethod from '@/components/credential/credentialCreationMethod/credentialCreationMethod.component';
import { getDownloadCredentialParameters } from '@/utils/credential/credentialDownload';
import { KMS_ROUTES_URIS } from '@/routes/routes.constants';
import { useOutletCredential } from '../Credential.page';
import { kmsIamActions } from '@/utils/iam/iam.constants';

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
  const { trackClick } = useOvhTracking();

  const {
    filename,
    href: downloadHref,
    isDisabled,
  } = getDownloadCredentialParameters(credential);

  const items: DashboardTileBlockItem[] = [
    {
      id: 'name',
      label: t('key_management_service_credential_dashboard_name'),
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {credential.name || credential.id}
        </OdsText>
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
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {credential.description || ''}
        </OdsText>
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
      value: (
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {credential.certificateType}
        </OdsText>
      ),
    },
    {
      id: 'origin',
      label: t('key_management_service_credential_dashboard_origin'),
      value: <CredentialCreationMethod fromCSR={credential.fromCSR} />,
    },
    {
      id: 'creation',
      label: t('key_management_service_credential_dashboard_creation'),
      value: (
        <TileValueDate value={credential.createdAt} options={dateFormat} />
      ),
    },
    {
      id: 'expiration',
      label: t('key_management_service_credential_dashboard_expiration'),
      value: (
        <TileValueDate value={credential.expiredAt} options={dateFormat} />
      ),
    },
  ];

  items.push({
    id: 'actions',
    label: t('key_management_service_credential_dashboard_actions'),
    value: (
      <div className="flex items-center gap-4">
        {downloadHref && (
          <OdsLink
            color={ODS_LINK_COLOR.primary}
            href={downloadHref}
            download={filename}
            isDisabled={isDisabled}
            onClick={() =>
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['download_access_certificate'],
              })
            }
            label={t('key_management_service_credential_download')}
            icon={ODS_ICON_NAME.download}
          />
        )}
        <ManagerButton
          id="deleteAccessCertificate"
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_BUTTON_COLOR.critical}
          variant={ODS_BUTTON_VARIANT.ghost}
          iamActions={[kmsIamActions.credentialDelete]}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['delete_access_certificate'],
            });
            navigate(KMS_ROUTES_URIS.credentialDelete);
          }}
          urn={okms.iam.urn}
          label={t('key_management_service_credential_delete')}
        />
      </div>
    ),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 break-words">
      <DashboardTile
        title={t(
          'key_management_service_credential_dashboard_tile_general_informations',
        )}
        items={items}
      />
      <Outlet />
    </div>
  );
};

export default CredentialGeneralInformations;
