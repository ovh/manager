import React, { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsInput } from '@ovhcloud/ods-components/react';
import { IdentityUser } from '@/types/identity.type';
import identityListSortAndFilter from '@/utils/credential/identityListSortAndFilter';
import IdentitiesUserTile from '../tile/IdentitiesUserTile.component';

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
      <OdsInput
        className="mb-4 w-full"
        name="search"
        placeholder={t(
          'key_management_service_credential_create_identities_user_list_search_placeholder',
        )}
        onOdsChange={(event) => filterTerms(event.detail.value as string)}
        type="search"
      />
      <div className="grid gap-3 mb-4">
        {sortedFilteredUsers.map((user) => (
          <IdentitiesUserTile
            key={user.urn}
            user={user}
            selectedUserList={selectedUserList}
            setSelectedUserList={setSelectedUserList}
          />
        ))}
      </div>
    </>
  );
};

export default IdentitiesUserList;
