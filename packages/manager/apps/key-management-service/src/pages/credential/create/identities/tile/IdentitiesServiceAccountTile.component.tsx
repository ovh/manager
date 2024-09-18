import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
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
      urn={serviceAccount.identity}
      updateCallback={updateServiceAccountInList}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    >
      <span>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
          {t(
            'key_management_service_credential_create_identities_service-account_tile_description_label',
          )}
          :
        </OsdsText>
        <IdentitiesTileText>{serviceAccount.description}</IdentitiesTileText>
      </span>
      <span>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
          {t(
            'key_management_service_credential_create_identities_service-account_tile_identity_label',
          )}
          :
        </OsdsText>
        <IdentitiesTileText>{serviceAccount.identity}</IdentitiesTileText>
      </span>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesServiceAccountTile;
