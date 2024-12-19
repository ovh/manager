import React, { Dispatch, SetStateAction, useState } from 'react';
import { OdsInput } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { IdentityGroup } from '@/types/identity.type';
import IdentitiesGroupTile from '../tile/IdentitiesGroupTile.component';
import identityListSortAndFilter from '@/utils/credential/identityListSortAndFilter';

type IdentitiesGroupListProps = {
  groupList: IdentityGroup[];
  selectedGroupList: IdentityGroup[];
  setSelectedGroupList: Dispatch<SetStateAction<IdentityGroup[]>>;
};

const IdentitiesGroupList = ({
  groupList,
  selectedGroupList,
  setSelectedGroupList,
}: IdentitiesGroupListProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [sortedFilteredGroups, setSortedFilteredGroups] = useState<
    IdentityGroup[]
  >(identityListSortAndFilter<IdentityGroup>(groupList, 'name'));

  const filterTerms = (searchTerm: string) => {
    setSortedFilteredGroups(
      identityListSortAndFilter<IdentityGroup>(groupList, 'name', searchTerm, [
        'name',
      ]),
    );
  };

  return (
    <>
      <OdsInput
        className="mb-4 w-full"
        name="search"
        placeholder={t(
          'key_management_service_credential_create_identities_group_list_search_placeholder',
        )}
        onOdsChange={(event) => filterTerms(event.detail.value as string)}
        type="search"
      />
      <div className="grid gap-3 mb-4">
        {sortedFilteredGroups.map((group) => (
          <IdentitiesGroupTile
            group={group}
            key={group.urn}
            selectedGroupList={selectedGroupList}
            setSelectedGroupList={setSelectedGroupList}
          />
        ))}
      </div>
    </>
  );
};

export default IdentitiesGroupList;
