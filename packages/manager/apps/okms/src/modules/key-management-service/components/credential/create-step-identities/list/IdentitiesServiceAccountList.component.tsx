import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import identityListSortAndFilter from '@key-management-service/utils/credential/identityListSortAndFilter';
import { useTranslation } from 'react-i18next';

import { Input } from '@ovhcloud/ods-react';

import { IdentitiesServiceAccountTile } from '../tile/IdentitiesServiceAccountTile.component';

type IdentitiesServiceAccountProps = {
  items: IdentityOauthClient[];
  selectedItems: IdentityOauthClient[];
  setSelectedItems: Dispatch<SetStateAction<IdentityOauthClient[]>>;
};

export const IdentitiesServiceAccountList = ({
  items,
  selectedItems,
  setSelectedItems,
}: IdentitiesServiceAccountProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [searchString, setSearchString] = useState('');

  const filteredItems = useMemo(() => {
    return identityListSortAndFilter<IdentityOauthClient>(items, 'name', searchString, [
      'name',
      'description',
    ]);
  }, [items, searchString]);

  const handleOnToggle = (item: IdentityOauthClient) => {
    setSelectedItems((prevItems) => {
      const isAlreadySelected = prevItems.some((selected) => selected.identity === item.identity);

      if (isAlreadySelected) {
        return prevItems.filter((selected) => selected.identity !== item.identity);
      }

      return [...prevItems, item];
    });
  };

  return (
    <>
      <Input
        className="mb-4 w-full"
        name="search"
        placeholder={t(
          'key_management_service_credential_create_identities_service-account_list_search_placeholder',
        )}
        onChange={(event) => setSearchString(event.target.value)}
        type="search"
      />
      <div className="mb-4 grid gap-3">
        {filteredItems.map((serviceAccount) => {
          const isSelected = selectedItems.some(
            (itemInList) => itemInList.identity === serviceAccount.identity,
          );
          return (
            <IdentitiesServiceAccountTile
              key={serviceAccount.identity}
              item={serviceAccount}
              isSelected={isSelected}
              onToggle={() => handleOnToggle(serviceAccount)}
            />
          );
        })}
      </div>
    </>
  );
};
