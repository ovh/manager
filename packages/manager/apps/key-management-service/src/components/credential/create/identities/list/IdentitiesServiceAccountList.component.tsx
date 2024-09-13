import React, { Dispatch, SetStateAction, useState } from 'react';
import { OsdsSearchBar, OsdsDivider } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { IdentityOauthClient } from '@/types/identity.type';
import IdentitiesServiceAccountTile from '../tile/IdentitiesServiceAccountTile.component';
import identityListSortAndFilter from '@/utils/credential/identityListSortAndFilter';

type IdentitiesServiceAccountProps = {
  serviceAccountList: IdentityOauthClient[];
  selectedServiceAccounts: IdentityOauthClient[];
  setSelectedServiceAccounts: Dispatch<SetStateAction<IdentityOauthClient[]>>;
};

const IdentitiesServiceAccountList = ({
  serviceAccountList,
  selectedServiceAccounts,
  setSelectedServiceAccounts,
}: IdentitiesServiceAccountProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [
    sortedFilteredServiceAccount,
    setSortedFilteredServiceAccount,
  ] = useState<IdentityOauthClient[]>(
    identityListSortAndFilter<IdentityOauthClient>(serviceAccountList, 'name'),
  );

  const filterTerms = (searchTerm: string) => {
    setSortedFilteredServiceAccount(
      identityListSortAndFilter<IdentityOauthClient>(
        serviceAccountList,
        'name',
        searchTerm,
        ['name', 'description'],
      ),
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
          'key_management_service_credential_create_identities_service-account_list_search_placeholder',
        )}
      />
      <OsdsDivider />
      <div className="flex flex-col gap-3">
        {sortedFilteredServiceAccount.map((serviceAccount) => (
          <IdentitiesServiceAccountTile
            serviceAccount={serviceAccount}
            key={serviceAccount.identity}
            selectedServiceAccountList={selectedServiceAccounts}
            setSelectedServiceAccountList={setSelectedServiceAccounts}
          />
        ))}
      </div>
    </>
  );
};

export default IdentitiesServiceAccountList;
