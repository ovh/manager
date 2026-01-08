import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import IdentitiesBaseTile from './IdentitiesBaseTile.component';
import { IdentityRow } from './IdentityRow.component';

type IdentitiesServiceAccountTileProps = {
  serviceAccount: IdentityOauthClient;
  selectedServiceAccountList: IdentityOauthClient[];
  setSelectedServiceAccountList: Dispatch<SetStateAction<IdentityOauthClient[]>>;
};
const IdentitiesServiceAccountTile = ({
  serviceAccount,
  selectedServiceAccountList,
  setSelectedServiceAccountList,
}: IdentitiesServiceAccountTileProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (
      selectedServiceAccountList.some(
        (serviceAccountInList) => serviceAccountInList.identity === serviceAccount.identity,
      )
    ) {
      // TODO: This is freaking bad and should be fixed someday
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChecked(true);
    }
  }, [selectedServiceAccountList, serviceAccount]);

  const updateServiceAccountInList = (isServiceAccountInList: boolean) => {
    if (isServiceAccountInList) {
      setSelectedServiceAccountList((prevServiceAccountList) => [
        ...prevServiceAccountList,
        serviceAccount,
      ]);
    } else {
      setSelectedServiceAccountList((prevServiceAccountList) =>
        prevServiceAccountList.filter(
          (serviceAccountInList) => serviceAccountInList.identity !== serviceAccount.identity,
        ),
      );
    }
  };

  return (
    <IdentitiesBaseTile
      title={serviceAccount.name}
      updateCallback={updateServiceAccountInList}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    >
      <div className="mb-2 space-y-1">
        <IdentityRow
          label={t(
            'key_management_service_credential_create_identities_service-account_tile_description_label',
          )}
          value={serviceAccount.description}
        />
        <IdentityRow
          label={t(
            'key_management_service_credential_create_identities_service-account_tile_identity_label',
          )}
          value={serviceAccount.identity || ''}
        />
      </div>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesServiceAccountTile;
