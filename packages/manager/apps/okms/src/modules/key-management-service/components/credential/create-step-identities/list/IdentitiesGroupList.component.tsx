import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { IdentityGroup } from '@key-management-service/types/identity.type';
import identityListSortAndFilter from '@key-management-service/utils/credential/identityListSortAndFilter';
import { useTranslation } from 'react-i18next';

import { OdsInput } from '@ovhcloud/ods-components/react';

import { IdentitiesGroupTile } from '../tile/IdentitiesGroupTile.component';

type IdentitiesGroupListProps = {
  items: IdentityGroup[];
  selectedItems: IdentityGroup[];
  setSelectedItems: Dispatch<SetStateAction<IdentityGroup[]>>;
};

export const IdentitiesGroupList = ({
  items,
  selectedItems,
  setSelectedItems,
}: IdentitiesGroupListProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [searchString, setSearchString] = useState('');

  const filteredItems = useMemo(() => {
    return identityListSortAndFilter<IdentityGroup>(items, 'name', searchString, ['name']);
  }, [items, searchString]);

  const handleOnToggle = (item: IdentityGroup) => {
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
          'key_management_service_credential_create_identities_group_list_search_placeholder',
        )}
        onOdsChange={(event) => setSearchString(event.detail.value as string)}
        type="search"
      />
      <div className="mb-4 grid gap-3">
        {filteredItems.map((group) => {
          const isSelected = selectedItems.some((itemInList) => itemInList.urn === group.urn);
          return (
            <IdentitiesGroupTile
              key={group.urn}
              item={group}
              isSelected={isSelected}
              onToggle={() => handleOnToggle(group)}
            />
          );
        })}
      </div>
    </>
  );
};
