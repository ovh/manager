import React from 'react';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { IdentityUser } from '@/types/identity.type';
import IdentitiesSelectedBase from './IdentitiesSelectedBase.component';
import IdentityUserLoginCell from './cell/user/IdentityUserLoginCell.component';
import IdentityUserGroupCell from './cell/user/IdentityUserGroupCell.component';
import IdentityUserStatusCell from './cell/user/IdentityUserStatusCell.component';
import IdentityUserDeleteActionCell from './cell/user/IdentityUserDeleteActionCell';

type IdentitiesSelectedUsersListProps = {
  identityURNs: string[];
};
const IdentitiesSelectedUsersList = ({
  identityURNs,
}: IdentitiesSelectedUsersListProps) => {
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
      title={t(
        'key_management_service_credential_create_identities_users_list_title',
      )}
      addCallback={() => {
        return navigate(ROUTES_URLS.createCredentialAddUserModal);
      }}
      addButtonLabel={t(
        'key_management_service_credential_create_identities_users_list_button_add_label',
      )}
      deleteCallback={() => {
        setUserList([]);
      }}
      datagridColumns={columns}
      items={userList}
      identityURNs={identityURNs}
    ></IdentitiesSelectedBase>
  );
};

export default IdentitiesSelectedUsersList;
