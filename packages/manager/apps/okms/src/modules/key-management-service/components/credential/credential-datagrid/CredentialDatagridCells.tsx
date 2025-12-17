import { useNavigate } from 'react-router-dom';

import { useFormattedDate } from '@key-management-service/hooks/useFormattedDate';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { getDownloadCredentialParameters } from '@key-management-service/utils/credential/credentialDownload';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import {
  ActionMenu,
  ActionMenuItem,
  Clipboard,
  DataGridTextCell,
  Links,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { CredentialStatus } from '../credential-status/CredentialStatus.component';

export const DatagridCredentialCellName = (credential: OkmsCredential) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  return (
    <div>
      <Links
        onClickReturn={() => {
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'action',
            actions: ['credential'],
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

export const DatagridCredentialCellIdentities = (credential: OkmsCredential) => {
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

export const DatagridCredentialCellCreationDate = (credential: OkmsCredential) => {
  const date = new Date(Date.parse(credential.createdAt));

  const formattedDate = useFormattedDate({
    date,
    options: dateFormatOptions,
  });

  return <DataGridTextCell>{formattedDate}</DataGridTextCell>;
};

export const DatagridCredentialCellExpirationDate = (credential: OkmsCredential) => {
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

export const DatagridCredentialCellActions = (credential: OkmsCredential, okms: OKMS) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { filename, href, isDisabled } = getDownloadCredentialParameters(credential);

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
          actions: ['download', 'credential'],
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
          actions: ['delete', 'credential'],
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
