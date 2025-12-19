import { Dispatch, SetStateAction, useState } from 'react';

import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import identityListSortAndFilter from '@key-management-service/utils/credential/identityListSortAndFilter';
import { useTranslation } from 'react-i18next';

import { OdsInput } from '@ovhcloud/ods-components/react';

import IdentitiesServiceAccountTile from '../tile/IdentitiesServiceAccountTile.component';

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
  const [sortedFilteredServiceAccount, setSortedFilteredServiceAccount] = useState<
    IdentityOauthClient[]
  >(identityListSortAndFilter<IdentityOauthClient>(serviceAccountList, 'name'));

  const filterTerms = (searchTerm: string) => {
    setSortedFilteredServiceAccount(
      identityListSortAndFilter<IdentityOauthClient>(serviceAccountList, 'name', searchTerm, [
        'name',
        'description',
      ]),
    );
  };
  return (
    <>
      <OdsInput
        className="mb-4 w-full"
        name="search"
        placeholder={t(
          'key_management_service_credential_create_identities_service-account_list_search_placeholder',
        )}
        onOdsChange={(event) => filterTerms(event.detail.value as string)}
        type="search"
      />
      <div className="mb-4 grid gap-3">
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
