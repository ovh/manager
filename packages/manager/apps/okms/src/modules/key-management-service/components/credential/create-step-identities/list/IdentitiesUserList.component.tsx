import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { IdentityUser } from '@key-management-service/types/identity.type';
import identityListSortAndFilter from '@key-management-service/utils/credential/identityListSortAndFilter';
import { useTranslation } from 'react-i18next';

import { OdsInput } from '@ovhcloud/ods-components/react';

import { IdentitiesUserTile } from '../tile/IdentitiesUserTile.component';

type IdentitiesUserListProps = {
  items: IdentityUser[];
  selectedItems: IdentityUser[];
  setSelectedItems: Dispatch<SetStateAction<IdentityUser[]>>;
};

export const IdentitiesUserList = ({
  items,
  selectedItems,
  setSelectedItems,
}: IdentitiesUserListProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [searchString, setSearchString] = useState('');

  const filteredItems = useMemo(() => {
    return identityListSortAndFilter<IdentityUser>(items, 'login', searchString, [
      'login',
      'email',
    ]);
  }, [items, searchString]);

  const handleOnToggle = (item: IdentityUser) => {
    setSelectedItems((prevItems) => {
      const isAlreadySelected = prevItems.some((selected) => selected.urn === item.urn);

      if (isAlreadySelected) {
        return prevItems.filter((selected) => selected.urn !== item.urn);
      }

      return [...prevItems, item];
    });
  };

  return (
    <>
      <OdsInput
        className="mb-4 w-full"
        name="search"
        placeholder={t(
          'key_management_service_credential_create_identities_user_list_search_placeholder',
        )}
        onOdsChange={(event) => setSearchString(event.detail.value as string)}
        type="search"
      />
      <div className="mb-4 grid gap-3">
        {filteredItems.map((item) => {
          const isSelected = selectedItems.some((itemInList) => itemInList.urn === item.urn);
          return (
            <IdentitiesUserTile
              key={item.urn}
              item={item}
              isSelected={isSelected}
              onToggle={() => handleOnToggle(item)}
            />
          );
        })}
      </div>
    </>
  );
};
