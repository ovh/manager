import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  Clipboard,
  DashboardTile,
  DashboardTileBlockItem,
  ManagerButton,
} from '@ovh-ux/manager-react-components';
import { CredentialStatus } from '@/components/credential/credentialStatus/CredentialStatus.component';
import { TileValueDate } from '@/components/dashboard/tile-value-date/tileValueDate.component';
import CredentialCreationMethod from '@/components/credential/credentialCreationMethod/credentialCreationMethod.component';
import { getDownloadCredentialParameters } from '@/utils/credential/credentialDownload';
import { ROUTES_URLS } from '@/routes/routes.constants';
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

  const { filename, href, isDisabled } = getDownloadCredentialParameters(
    credential,
  );

  const items: DashboardTileBlockItem[] = [
    {
      id: 'name',
      label: t('key_management_service_credential_dashboard_name'),
      value: credential.name || credential.id,
    },
    {
      id: 'id',
      label: t('key_management_service_credential_dashboard_id'),
      value: <Clipboard value={credential.id} />,
    },
    {
      id: 'description',
      label: t('key_management_service_credential_dashboard_description'),
      value: credential.description || '',
    },
    {
      id: 'status',
      label: t('key_management_service_credential_dashboard_status'),
      value: <CredentialStatus state={credential.status} inline />,
    },
    {
      id: 'creation',
      label: t('key_management_service_credential_dashboard_creation'),
      value: (
        <div className="flex flex-col">
          <CredentialCreationMethod fromCSR={credential.fromCSR} />
          <TileValueDate value={credential.createdAt} options={dateFormat} />
        </div>
      ),
    },
    {
      id: 'expiration',
      label: t('key_management_service_credential_dashboard_expiration'),
      value: (
        <TileValueDate value={credential.expiredAt} options={dateFormat} />
      ),
    },
    {
      id: 'actions',
      label: t('key_management_service_credential_dashboard_actions'),
      value: (
        <div className="flex gap-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            href={href}
            download={filename}
            disabled={isDisabled || undefined}
          >
            {t('key_management_service_credential_download')}
          </OsdsButton>
          <ManagerButton
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.error}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={() => navigate(ROUTES_URLS.credentialDelete)}
            iamActions={['okms:apiovh:credential/delete']}
            urn={okms.iam.urn}
          >
            {t('key_management_service_credential_delete')}
          </ManagerButton>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <DashboardTile
        title={t(
          'key_management_service_credential_dashboard_tile_general_informations',
        )}
        items={items}
      ></DashboardTile>
      <Outlet />
    </div>
  );
};

export default CredentialGeneralInformations;
