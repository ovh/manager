import {
  Datagrid,
  DatagridColumn,
  ErrorBanner,
} from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import {
  getOkmsCredentialsQueryKey,
  useOkmsCredentials,
} from '@/data/hooks/useOkmsCredential';
import {
  DatagridCredentialCellActions,
  DatagridCredentialCellCreationDate,
  DatagridCredentialCellExpirationDate,
  DatagridCredentialCellId,
  DatagridCredentialCellIdentities,
  DatagridCredentialCellName,
  DatagridCredentialCellStatus,
} from '@/components/credential/credentialDatagrid/CredentialDatagridCells';
import Loading from '@/components/Loading/Loading';
import { OkmsCredential } from '@/types/okmsCredential.type';
import { OKMS } from '@/types/okms.type';

type CredentialDatagridProps = {
  okms: OKMS;
};

const CredentialDatagrid = ({ okms }: CredentialDatagridProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    data: credentials,
    isLoading: isLoadingCredentials,
    error: credentialsError,
  } = useOkmsCredentials({
    okmsId: okms.id,
    deletingCredentialId: state?.deletingCredentialId,
  });

  if (isLoadingCredentials) return <Loading />;

  if (credentialsError)
    return (
      <ErrorBanner
        error={credentialsError}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsCredentialsQueryKey(okms.id),
          })
        }
      />
    );

  const columns: DatagridColumn<OkmsCredential>[] = [
    {
      id: 'name',
      cell: DatagridCredentialCellName,
      label: t('key_management_service_credential_list_column_name'),
      isSortable: false,
    },
    {
      id: 'id',
      cell: DatagridCredentialCellId,
      label: t('key_management_service_credential_list_column_id'),
      isSortable: false,
    },
    {
      id: 'identities',
      cell: DatagridCredentialCellIdentities,
      label: t('key_management_service_credential_list_column_identities'),
      isSortable: false,
    },
    {
      id: 'creation_date',
      cell: DatagridCredentialCellCreationDate,
      label: t('key_management_service_credential_list_column_creation_date'),
      isSortable: false,
    },
    {
      id: 'expiration_date',
      cell: DatagridCredentialCellExpirationDate,
      label: t('key_management_service_credential_list_column_expiration_date'),
      isSortable: false,
    },
    {
      id: 'status',
      cell: DatagridCredentialCellStatus,
      label: t('key_management_service_credential_list_column_status'),
      isSortable: false,
    },
    {
      id: 'actions',
      cell: (credential: OkmsCredential) =>
        DatagridCredentialCellActions(credential, okms),
      label: '',
      isSortable: false,
    },
  ];

  return (
    <Datagrid
      columns={columns}
      items={credentials?.data || []}
      totalItems={credentials?.data.length || 0}
      contentAlignLeft
    />
  );
};

export default CredentialDatagrid;
