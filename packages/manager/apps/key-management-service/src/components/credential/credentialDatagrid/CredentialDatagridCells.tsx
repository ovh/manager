import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  ActionMenuItem,
  Clipboard,
  DataGridTextCell,
  Links,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OkmsCredential } from '@/types/okmsCredential.type';
import { useFormattedDate } from '@/hooks/useFormattedDate';
import { CredentialStatus } from '../credentialStatus/CredentialStatus.component';
import { getDownloadCredentialParameters } from '@/utils/credential/credentialDownload';
import { KMS_ROUTES_URIS } from '@/routes/routes.constants';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { OKMS } from '@/types/okms.type';

export const DatagridCredentialCellName = (credential: OkmsCredential) => {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  return (
    <div>
      <Links
        onClickReturn={() => {
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'action',
            actions: ['details_access_certificate'],
          });
          navigate(`${credential.id}`);
        }}
        label={credential.name}
      />
    </div>
  );
};

export const DatagridCredentialCellId = (credential: OkmsCredential) => {
  return <Clipboard className="w-full" value={credential.id} />;
};

export const DatagridCredentialCellIdentities = (
  credential: OkmsCredential,
) => {
  const identities = credential.identityURNs.length;
  return <DataGridTextCell>{identities}</DataGridTextCell>;
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

export const DatagridCredentialCellCreationDate = (
  credential: OkmsCredential,
) => {
  const date = new Date(Date.parse(credential.createdAt));

  const formattedDate = useFormattedDate({
    date,
    options: dateFormatOptions,
  });

  return <DataGridTextCell>{formattedDate}</DataGridTextCell>;
};

export const DatagridCredentialCellExpirationDate = (
  credential: OkmsCredential,
) => {
  const date = new Date(Date.parse(credential.expiredAt));

  const formattedDate = useFormattedDate({
    date,
    options: dateFormatOptions,
  });

  return <DataGridTextCell>{formattedDate}</DataGridTextCell>;
};

export const DatagridCredentialCellStatus = (credential: OkmsCredential) => {
  return <CredentialStatus state={credential.status} />;
};

export const DatagridCredentialCellActions = (
  credential: OkmsCredential,
  okms: OKMS,
) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { filename, href, isDisabled } = getDownloadCredentialParameters(
    credential,
  );

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('key_management_service_credential_download'),
      href,
      download: filename,
      isDisabled,
      onClick: () =>
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'action',
          actions: ['download_access_certificate'],
        }),
    },
    {
      id: 2,
      label: t('key_management_service_credential_delete'),
      iamActions: [kmsIamActions.credentialDelete],
      urn: okms?.iam.urn,
      onClick: () => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'action',
          actions: ['delete_access_certificate'],
        });
        navigate(`${KMS_ROUTES_URIS.credentialDelete}/${credential.id}`);
      },
    },
  ];

  return (
    <ActionMenu
      id={`credentialsActions-${credential.id}`}
      items={items}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
};
