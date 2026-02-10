import { useNavigate } from 'react-router-dom';

import { useFormattedDate } from '@key-management-service/hooks/useFormattedDate';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { getDownloadCredentialParameters } from '@key-management-service/utils/credential/credentialDownload';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { ActionMenu, ActionMenuItemProps, BUTTON_VARIANT } from '@ovh-ux/muk';
import { Clipboard } from '@ovh-ux/muk';

import { MukLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';

import { CredentialStatus } from '../credential-status-badge/CredentialStatusBadge.component';
import { CREDENTIAL_LIST_CELL_TEST_IDS } from './CredentialDatagridCells.constants';

export const DatagridCredentialCellName = (credential: OkmsCredential) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  return (
    <div>
      <MukLink
        onClick={() => {
          trackClick({
            location: PageLocation.datagrid,
            buttonType: ButtonType.link,
            actionType: 'action',
            actions: ['credential'],
          });
          navigate(`${credential.id}`);
        }}
        data-testid={CREDENTIAL_LIST_CELL_TEST_IDS.name(credential.id)}
      >
        {credential.name}
      </MukLink>
    </div>
  );
};

export const DatagridCredentialCellId = (credential: OkmsCredential) => {
  return (
    <Clipboard
      className="w-full"
      value={credential.id}
      data-testid={CREDENTIAL_LIST_CELL_TEST_IDS.id(credential.id)}
    />
  );
};

export const DatagridCredentialCellIdentities = (credential: OkmsCredential) => {
  const identities = credential.identityURNs.length;
  return (
    <Text preset="span" data-testid={CREDENTIAL_LIST_CELL_TEST_IDS.nbUsersIds(credential.id)}>
      {identities}
    </Text>
  );
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

  return (
    <Text preset="span" data-testid={CREDENTIAL_LIST_CELL_TEST_IDS.creationDate(credential.id)}>
      {formattedDate}
    </Text>
  );
};

export const DatagridCredentialCellExpirationDate = (credential: OkmsCredential) => {
  const date = new Date(Date.parse(credential.expiredAt));

  const formattedDate = useFormattedDate({
    date,
    options: dateFormatOptions,
  });

  return (
    <Text preset="span" data-testid={CREDENTIAL_LIST_CELL_TEST_IDS.expirationDate(credential.id)}>
      {formattedDate}
    </Text>
  );
};

export const DatagridCredentialCellStatus = (credential: OkmsCredential) => {
  return (
    <CredentialStatus
      state={credential.status}
      data-testid={CREDENTIAL_LIST_CELL_TEST_IDS.status(credential.id)}
    />
  );
};

export const DatagridCredentialCellActions = (credential: OkmsCredential, okms: OKMS) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { filename, href, isDisabled } = getDownloadCredentialParameters(credential);

  const items: ActionMenuItemProps[] = [
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
    <div data-testid={CREDENTIAL_LIST_CELL_TEST_IDS.actions(credential.id)}>
      <ActionMenu
        id={`credentialsActions-${credential.id}`}
        items={items}
        variant={BUTTON_VARIANT.ghost}
        isCompact
      />
    </div>
  );
};
