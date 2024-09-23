import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_CHIP_SIZE, ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
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
      urn={user.urn}
      updateCallback={updateUserInList}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    >
      <span>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
          {t(
            'key_management_service_credential_create_identities_user_tile_email_label',
          )}
          :
        </OsdsText>
        <IdentitiesTileText>{user.email}</IdentitiesTileText>
      </span>
      <span>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
          {t(
            'key_management_service_credential_create_identities_user_tile_group_label',
          )}
          :
        </OsdsText>
        <IdentitiesTileText>{user.group} </IdentitiesTileText>
      </span>
      <span>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
          {t(
            'key_management_service_credential_create_identities_user_tile_identity_label',
          )}
          :
        </OsdsText>
        <IdentitiesTileText>{user.urn}</IdentitiesTileText>
      </span>
      <span>
        <IdentitiesStatusBadge
          status={user.status}
          inline
          size={ODS_CHIP_SIZE.sm}
        />
      </span>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesUserTile;
