import React, { Dispatch, SetStateAction, useState } from 'react';
import { OsdsSearchBar, OsdsDivider } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import IdentitiesUserTile from '../tile/IdentitiesUserTile.component';
import { IdentityUser } from '@/types/identity.type';
import identityListSortAndFilter from '@/utils/credential/identityListSortAndFilter';

type IdentitiesUserListProps = {
  userList: IdentityUser[];
  selectedUserList: IdentityUser[];
  setSelectedUserList: Dispatch<SetStateAction<IdentityUser[]>>;
};

const IdentitiesUserList = ({
  userList,
  selectedUserList,
  setSelectedUserList,
}: IdentitiesUserListProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [sortedFilteredUsers, setSortedFilteredUsers] = useState<
    IdentityUser[]
  >(identityListSortAndFilter<IdentityUser>(userList, 'login'));

  const filterTerms = (searchTerm: string) => {
    setSortedFilteredUsers(
      identityListSortAndFilter<IdentityUser>(userList, 'login', searchTerm, [
        'login',
        'email',
      ]),
    );
  };

  return (
    <>
      <OsdsSearchBar
        onOdsValueChange={(searchText) => {
          return filterTerms(searchText.detail.value);
        }}
        onOdsSearchSubmit={(searchText) => {
          return filterTerms(searchText.detail.inputValue);
        }}
        placeholder={t(
          'key_management_service_credential_create_identities_user_list_search_placeholder',
        )}
      />
      <OsdsDivider />
      <div className="flex flex-col gap-3">
        {sortedFilteredUsers.map((user) => (
          <IdentitiesUserTile
            user={user}
            key={user.urn}
            selectedUserList={selectedUserList}
            setSelectedUserList={setSelectedUserList}
          />
        ))}
      </div>
    </>
  );
};

export default IdentitiesUserList;
