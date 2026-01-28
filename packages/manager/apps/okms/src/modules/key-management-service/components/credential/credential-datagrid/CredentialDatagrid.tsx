import { useLocation, useNavigate } from 'react-router-dom';

import {
  DatagridCredentialCellActions,
  DatagridCredentialCellCreationDate,
  DatagridCredentialCellExpirationDate,
  DatagridCredentialCellId,
  DatagridCredentialCellIdentities,
  DatagridCredentialCellName,
  DatagridCredentialCellStatus,
} from '@key-management-service/components/credential/credential-datagrid/CredentialDatagridCells';
import {
  getOkmsCredentialsQueryKey,
  useOkmsCredentials,
} from '@key-management-service/data/hooks/useOkmsCredential';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { OKMS } from '@key-management-service/types/okms.type';
import { OkmsCredential } from '@key-management-service/types/okmsCredential.type';
import { useTranslation } from 'react-i18next';

import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Error } from '@ovh-ux/muk';

import Loading from '@/common/components/loading/Loading';

type CredentialDatagridProps = {
  okms: OKMS;
};

const CredentialDatagrid = ({ okms }: CredentialDatagridProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { deletingCredentialId?: string } };

  const {
    data: credentials,
    isPending: isPending,
    error: credentialsError,
  } = useOkmsCredentials({
    okmsId: okms.id,
    deletingCredentialId: state?.deletingCredentialId,
  });

  const handleReloadPage = () => {
    queryClient
      .refetchQueries({
        queryKey: getOkmsCredentialsQueryKey(okms.id),
      })
      .catch((error) => console.error(error));
  };

  if (isPending) {
    return <Loading />;
  }

  if (credentialsError)
    return (
      <Error
        error={credentialsError}
        onRedirectHome={() => navigate(KMS_ROUTES_URLS.kmsListing)}
        onReloadPage={handleReloadPage}
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
      cell: (credential: OkmsCredential) => DatagridCredentialCellActions(credential, okms),
      label: '',
      isSortable: false,
    },
  ];

  return (
    <Datagrid
      columns={columns}
      items={credentials}
      totalItems={credentials.length}
      contentAlignLeft
    />
  );
};

export default CredentialDatagrid;
