import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { IdentitiesStatusBadge } from '../../badge/IdentitiesStatusBadge.component';
import { IdentitySelectionBase } from '../base/IdentitySelectionBase.component';
import { RemoveIdentityButton } from '../base/RemoveIdentityButton.component';
import { IDENTITY_SELECTION_USERS_TEST_IDS } from './IdentitySelectionUsers.constants';

type IdentitySelectionUsersProps = {
  identityURNs: string[];
};

export const IdentitySelectionUsers = ({ identityURNs }: IdentitySelectionUsersProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { userList, setUserList } = useIdentityData();

  const handleRemoveUser = (user: IdentityUser) => {
    setUserList((prevUserList) => prevUserList.filter((userInList) => userInList.urn !== user.urn));
  };

  const columns: DatagridColumn<IdentityUser>[] = [
    {
      id: 'login',
      cell: (user: IdentityUser) => (
        <DataGridTextCell data-testid={IDENTITY_SELECTION_USERS_TEST_IDS.name(user.urn)}>
          {user.login}
        </DataGridTextCell>
      ),
      label: t('key_management_service_credential_user_list_column_name'),
    },
    {
      id: 'group',
      cell: (user: IdentityUser) => (
        <DataGridTextCell data-testid={IDENTITY_SELECTION_USERS_TEST_IDS.group(user.urn)}>
          {user.group}
        </DataGridTextCell>
      ),
      label: t('key_management_service_credential_user_list_column_group'),
    },
    {
      id: 'status',
      cell: (user: IdentityUser) => (
        <IdentitiesStatusBadge
          status={user.status}
          data-testid={IDENTITY_SELECTION_USERS_TEST_IDS.status(user.urn)}
        />
      ),
      label: t('key_management_service_credential_user_list_column_status'),
    },
    {
      id: 'remove',
      cell: (user: IdentityUser) => (
        <RemoveIdentityButton
          onClick={() => handleRemoveUser(user)}
          testId={IDENTITY_SELECTION_USERS_TEST_IDS.removeButton(user.urn)}
        />
      ),
      label: '',
    },
  ];

  return (
    <IdentitySelectionBase
      title={t('key_management_service_credential_create_identities_users_list_title')}
      addCallback={() => navigate(KMS_ROUTES_URIS.credentialCreateAddUserModal)}
      addButtonLabel={t(
        'key_management_service_credential_create_identities_users_list_button_add_label',
      )}
      addButtonTestId={IDENTITY_SELECTION_USERS_TEST_IDS.addButton}
      deleteCallback={() => setUserList([])}
      deleteButtonTestId={IDENTITY_SELECTION_USERS_TEST_IDS.deleteButton}
      datagridColumns={columns}
      items={userList}
      identityURNs={identityURNs}
    />
  );
};
