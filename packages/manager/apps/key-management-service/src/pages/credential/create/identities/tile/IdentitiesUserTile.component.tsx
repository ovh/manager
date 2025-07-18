import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { IdentityUser } from '@/types/identity.type';
import IdentitiesTileText from './IdentitiesTileText.component';
import IdentitiesBaseTile from './IdentitiesBaseTile.component';
import IdentitiesStatusBadge from '../badge/IdentitiesStatusBadge.component';

type IdentitiesUserTileProps = {
  user: IdentityUser;
  selectedUserList: IdentityUser[];
  setSelectedUserList: Dispatch<SetStateAction<IdentityUser[]>>;
};

const IdentitiesUserTile = ({
  user,
  selectedUserList,
  setSelectedUserList,
}: IdentitiesUserTileProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (selectedUserList.find((userInList) => userInList.urn === user.urn)) {
      setIsChecked(true);
    }
  }, [selectedUserList, user]);

  const updateUserInList = (isInList: boolean) => {
    if (isInList) {
      setSelectedUserList((prevUserList) => [...prevUserList, user]);
    } else {
      setSelectedUserList((prevUserList) =>
        prevUserList.filter((userInList) => userInList.urn !== user.urn),
      );
    }
  };

  return (
    <IdentitiesBaseTile
      title={user.login}
      updateCallback={updateUserInList}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    >
      <div>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            'key_management_service_credential_create_identities_user_tile_email_label',
          )}
          :
        </OdsText>
        <IdentitiesTileText>{user.email}</IdentitiesTileText>
      </div>
      <div>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            'key_management_service_credential_create_identities_user_tile_group_label',
          )}
          :
        </OdsText>
        <IdentitiesTileText>{user.group} </IdentitiesTileText>
      </div>
      <div>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            'key_management_service_credential_create_identities_user_tile_identity_label',
          )}
          :
        </OdsText>
        <IdentitiesTileText>{user.urn}</IdentitiesTileText>
      </div>
      <IdentitiesStatusBadge status={user.status} />
    </IdentitiesBaseTile>
  );
};

export default IdentitiesUserTile;
