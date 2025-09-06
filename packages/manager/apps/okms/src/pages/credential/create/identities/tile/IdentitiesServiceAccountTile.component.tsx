import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { IdentityOauthClient } from '@/types/identity.type';
import IdentitiesBaseTile from './IdentitiesBaseTile.component';
import IdentitiesTileText from './IdentitiesTileText.component';

type IdentitiesServiceAccountTileProps = {
  serviceAccount: IdentityOauthClient;
  selectedServiceAccountList: IdentityOauthClient[];
  setSelectedServiceAccountList: Dispatch<
    SetStateAction<IdentityOauthClient[]>
  >;
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
        (serviceAccountInList) =>
          serviceAccountInList.identity === serviceAccount.identity,
      )
    ) {
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
          (serviceAccountInList) =>
            serviceAccountInList.identity !== serviceAccount.identity,
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
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            'key_management_service_credential_create_identities_service-account_tile_description_label',
          )}
          :
        </OdsText>
        <IdentitiesTileText>{serviceAccount.description}</IdentitiesTileText>
      </div>
      <div>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            'key_management_service_credential_create_identities_service-account_tile_identity_label',
          )}
          :
        </OdsText>
        <IdentitiesTileText>{serviceAccount.identity}</IdentitiesTileText>
      </div>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesServiceAccountTile;
