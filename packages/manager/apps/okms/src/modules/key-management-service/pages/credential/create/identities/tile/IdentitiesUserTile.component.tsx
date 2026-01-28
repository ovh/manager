import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import IdentitiesStatusBadge from '../badge/IdentitiesStatusBadge.component';
import IdentitiesBaseTile from './IdentitiesBaseTile.component';
import { IdentityRow } from './IdentityRow.component';

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
      // TODO: This is freaking bad and should be fixed someday
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="mb-2 space-y-1">
        <IdentityRow
          label={t('key_management_service_credential_create_identities_user_tile_email_label')}
          value={user.email}
        />
        <IdentityRow
          label={t('key_management_service_credential_create_identities_user_tile_group_label')}
          value={user.group}
        />
        <IdentityRow
          label={t('key_management_service_credential_create_identities_user_tile_identity_label')}
          value={user.urn}
        />
      </div>
      <IdentitiesStatusBadge status={user.status} />
    </IdentitiesBaseTile>
  );
};

export default IdentitiesUserTile;
