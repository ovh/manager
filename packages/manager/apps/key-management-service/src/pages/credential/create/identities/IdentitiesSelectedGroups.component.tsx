import { DatagridColumn } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { IdentityGroup } from '@/types/identity.type';
import IdentitiesSelectedBase from './IdentitiesSelectedBase.component';
import IdentityGroupNameCell from './cell/group/IdentityGroupNameCell.component';
import IdentityGroupDescriptionCell from './cell/group/IdentityGroupDescriptionCell.component';
import IdentityGroupDeleteActionCell from './cell/group/IdentityGroupDeleteActionCell';

type IdentitiesSelectedGroupsProps = {
  identityURNs: string[];
};

const IdentitiesSelectedGroups = ({
  identityURNs,
}: IdentitiesSelectedGroupsProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { groupList, setGroupList } = useIdentityData();

  const columns: DatagridColumn<IdentityGroup>[] = [
    {
      id: 'name',
      cell: IdentityGroupNameCell,
      label: t('key_management_service_credential_user_list_column_name'),
      isSortable: false,
    },
    {
      id: 'description',
      cell: IdentityGroupDescriptionCell,
      label: t(
        'key_management_service_credential_user_list_column_description',
      ),
      isSortable: false,
    },
    {
      id: 'action',
      cell: IdentityGroupDeleteActionCell,
      label: '',
      isSortable: false,
    },
  ];
  return (
    <IdentitiesSelectedBase
      title={t(
        'key_management_service_credential_create_identities_users_groups_title',
      )}
      addCallback={() => navigate(ROUTES_URLS.createCredentialAddGroupsModal)}
      addButtonLabel={t(
        'key_management_service_credential_create_identities_users_groups_button_add_label',
      )}
      deleteCallback={() => setGroupList([])}
      datagridColumns={columns}
      items={groupList}
      identityURNs={identityURNs}
    ></IdentitiesSelectedBase>
  );
};

export default IdentitiesSelectedGroups;
