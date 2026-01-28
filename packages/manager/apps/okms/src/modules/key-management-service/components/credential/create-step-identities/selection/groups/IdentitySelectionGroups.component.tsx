import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { IdentityGroup } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { IdentitySelectionBase } from '../base/IdentitySelectionBase.component';
import { RemoveIdentityButton } from '../base/RemoveIdentityButton.component';

type IdentitySelectionProps = {
  identityURNs: string[];
};

export const IdentitySelectionGroups = ({ identityURNs }: IdentitySelectionProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const navigate = useNavigate();
  const { groupList, setGroupList } = useIdentityData();

  const handleRemoveGroup = (group: IdentityGroup) => {
    setGroupList((prevGroupList) =>
      prevGroupList.filter((groupInList) => groupInList.urn !== group.urn),
    );
  };

  const columns: DatagridColumn<IdentityGroup>[] = [
    {
      id: 'name',
      cell: (group: IdentityGroup) => <DataGridTextCell>{group.name}</DataGridTextCell>,
      label: t('key_management_service_credential_user_list_column_name'),
    },
    {
      id: 'description',
      cell: (group: IdentityGroup) => <DataGridTextCell>{group.description}</DataGridTextCell>,
      label: t('key_management_service_credential_user_list_column_description'),
    },
    {
      id: 'identity',
      cell: (group: IdentityGroup) => <DataGridTextCell>{group.urn}</DataGridTextCell>,
      label: t('key_management_service_credential_create_identities_group_tile_identity_label'),
    },
    {
      id: 'action',
      cell: (group: IdentityGroup) => (
        <RemoveIdentityButton
          onClick={() => handleRemoveGroup(group)}
          testId={`remove-group-button-${group.urn}`}
        />
      ),
      label: '',
    },
  ];

  return (
    <IdentitySelectionBase
      title={t('key_management_service_credential_create_identities_users_groups_title')}
      addCallback={() => navigate(KMS_ROUTES_URIS.credentialCreateAddGroupModal)}
      addButtonLabel={t(
        'key_management_service_credential_create_identities_users_groups_button_add_label',
      )}
      deleteCallback={() => setGroupList([])}
      datagridColumns={columns}
      items={groupList}
      identityURNs={identityURNs}
    />
  );
};
