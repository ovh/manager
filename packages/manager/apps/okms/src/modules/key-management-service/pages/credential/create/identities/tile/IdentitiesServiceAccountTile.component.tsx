import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import IdentitiesBaseTile from './IdentitiesBaseTile.component';
import IdentitiesTileText from './IdentitiesTileText.component';

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
      <div>
        <Text preset="caption">
          {t(
            'key_management_service_credential_create_identities_service-account_tile_description_label',
          )}
          :
        </Text>
        <IdentitiesTileText>{serviceAccount.description}</IdentitiesTileText>
      </div>
      <div>
        <Text preset="caption">
          {t(
            'key_management_service_credential_create_identities_service-account_tile_identity_label',
          )}
          :
        </Text>
        <IdentitiesTileText>{serviceAccount.identity}</IdentitiesTileText>
      </div>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesServiceAccountTile;
