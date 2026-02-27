import { useNavigate } from 'react-router-dom';

import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { KMS_ROUTES_URIS } from '@key-management-service/routes/routes.constants';
import { IdentityGroup } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

import { IdentitySelectionBase } from '../base/IdentitySelectionBase.component';
import { RemoveIdentityButton } from '../base/RemoveIdentityButton.component';
import { IDENTITY_SELECTION_GROUP_TEST_IDS } from './IdentitySelectionGroups.constants';

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
      cell: (group: IdentityGroup) => (
        <Text preset="span" data-testid={IDENTITY_SELECTION_GROUP_TEST_IDS.name(group.urn)}>
          {group.name}
        </Text>
      ),
      label: t('key_management_service_credential_user_list_column_name'),
    },
    {
      id: 'description',
      cell: (group: IdentityGroup) => (
        <Text preset="span" data-testid={IDENTITY_SELECTION_GROUP_TEST_IDS.description(group.urn)}>
          {group.description}
        </Text>
      ),
      label: t('key_management_service_credential_user_list_column_description'),
    },
    {
      id: 'identity',
      cell: (group: IdentityGroup) => (
        <Text preset="span" data-testid={IDENTITY_SELECTION_GROUP_TEST_IDS.identity(group.urn)}>
          {group.urn}
        </Text>
      ),
      label: t('key_management_service_credential_create_identities_group_tile_identity_label'),
    },
    {
      id: 'action',
      cell: (group: IdentityGroup) => (
        <RemoveIdentityButton
          onClick={() => handleRemoveGroup(group)}
          testId={IDENTITY_SELECTION_GROUP_TEST_IDS.removeButton(group.urn)}
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
      addButtonTestId={IDENTITY_SELECTION_GROUP_TEST_IDS.addButton}
      deleteCallback={() => setGroupList([])}
      deleteButtonTestId={IDENTITY_SELECTION_GROUP_TEST_IDS.deleteButton}
      datagridColumns={columns}
      items={groupList}
      identityURNs={identityURNs}
    />
  );
};
