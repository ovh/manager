import {
  Datagrid,
  ErrorBanner,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { useOkmsCredentials } from '@/data/hooks/useOkmsCredential';
import {
  DatagridCredentialCellCreationDate,
  DatagridCredentialCellExpirationDate,
  DatagridCredentialCellId,
  DatagridCredentialCellIdentities,
  DatagridCredentialCellName,
  DatagridCredentialCellStatus,
} from '@/components/credential/credentialDatagrid/credentialDatagridCells';
import { getOkmsCredentialsQueryKey } from '@/data/api/okmsCredential';
import Loading from '@/components/Loading/Loading';

const CredentialDatagrid = () => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { okmsId } = useParams();

  const { sorting, setSorting } = useDatagridSearchParams();

  const {
    data: credentials,
    isLoading: isLoadingCredentials,
    error: credentialsError,
  } = useOkmsCredentials({ sorting, okmsId });

  if (isLoadingCredentials) return <Loading />;

  if (credentialsError)
    return (
      <ErrorBanner
        error={credentialsError}
        onRedirectHome={() => navigate(ROUTES_URLS.listing)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getOkmsCredentialsQueryKey(okmsId),
          })
        }
      />
    );

  const columns = [
    {
      id: 'name',
      cell: DatagridCredentialCellName,
      label: t('key_management_service_credential_list_column_name'),
    },
    {
      id: 'id',
      cell: DatagridCredentialCellId,
      label: t('key_management_service_credential_list_column_id'),
    },
    {
      id: 'identities',
      cell: DatagridCredentialCellIdentities,
      label: t('key_management_service_credential_list_column_identities'),
    },
    {
      id: 'creation_date',
      cell: DatagridCredentialCellCreationDate,
      label: t('key_management_service_credential_list_column_creation_date'),
    },
    {
      id: 'expiration_date',
      cell: DatagridCredentialCellExpirationDate,
      label: t('key_management_service_credential_list_column_expiration_date'),
    },
    {
      id: 'status',
      cell: DatagridCredentialCellStatus,
      label: t('key_management_service_credential_list_column_status'),
    },
  ];

  return (
    <Datagrid
      columns={columns}
      items={credentials || []}
      totalItems={credentials.length}
      sorting={sorting}
      onSortChange={setSorting}
      contentAlignLeft
    />
  );
};

export default CredentialDatagrid;
