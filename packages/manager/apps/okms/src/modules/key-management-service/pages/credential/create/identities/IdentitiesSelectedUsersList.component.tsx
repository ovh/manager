import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

import IdentitiesSelectedBase from './IdentitiesSelectedBase.component';
import IdentityUserDeleteActionCell from './cell/user/IdentityUserDeleteActionCell';
import IdentityUserGroupCell from './cell/user/IdentityUserGroupCell.component';
import IdentityUserLoginCell from './cell/user/IdentityUserLoginCell.component';
import IdentityUserStatusCell from './cell/user/IdentityUserStatusCell.component';

type IdentitiesSelectedUsersListProps = {
  identityURNs: string[];
};
const IdentitiesSelectedUsersList = ({ identityURNs }: IdentitiesSelectedUsersListProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { userList, setUserList } = useIdentityData();

  const columns: DatagridColumn<IdentityUser>[] = [
    {
      id: 'login',
      cell: IdentityUserLoginCell,
      label: t('key_management_service_credential_user_list_column_name'),
      isSortable: false,
    },
    {
      id: 'group',
      cell: IdentityUserGroupCell,
      label: t('key_management_service_credential_user_list_column_group'),
      isSortable: false,
    },
    {
      id: 'status',
      cell: IdentityUserStatusCell,
      label: t('key_management_service_credential_user_list_column_status'),
      isSortable: false,
    },
    {
      id: 'action',
      cell: IdentityUserDeleteActionCell,
      label: '',
      isSortable: false,
    },
  ];

  return (
    <IdentitiesSelectedBase
      title={t('key_management_service_credential_create_identities_users_list_title')}
      addCallback={() => navigate(KMS_ROUTES_URIS.credentialCreateAddUserModal)}
      addButtonLabel={t(
        'key_management_service_credential_create_identities_users_list_button_add_label',
      )}
      deleteCallback={() => setUserList([])}
      datagridColumns={columns}
      items={userList}
      identityURNs={identityURNs}
    />
  );
};

export default IdentitiesSelectedUsersList;
