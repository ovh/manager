import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { IdentityGroup } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import IdentitiesBaseTile from './IdentitiesBaseTile.component';
import IdentitiesTileText from './IdentitiesTileText.component';

type IdentitiesGroupTileProps = {
  group: IdentityGroup;
  selectedGroupList: IdentityGroup[];
  setSelectedGroupList: Dispatch<SetStateAction<IdentityGroup[]>>;
};
const IdentitiesGroupTile = ({
  group,
  selectedGroupList,
  setSelectedGroupList,
}: IdentitiesGroupTileProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (selectedGroupList.some((groupInList) => groupInList.urn === group.urn)) {
      // TODO: This is freaking bad and should be fixed someday
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChecked(true);
    }
  }, [selectedGroupList, group]);

  const updateGroupInList = (isGroupInList: boolean) => {
    setSelectedGroupList((prevGroupList) =>
      isGroupInList
        ? prevGroupList.concat(group)
        : prevGroupList.filter((groupInList) => groupInList.urn !== group.urn),
    );
  };

  return (
    <IdentitiesBaseTile
      title={group.name}
      updateCallback={updateGroupInList}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    >
      <div>
        <Text preset="caption">
          {t('key_management_service_credential_create_identities_group_tile_description_label')}:
        </Text>
        <IdentitiesTileText>{group.description}</IdentitiesTileText>
      </div>
      <div>
        <Text preset="caption">
          {t('key_management_service_credential_create_identities_group_tile_identity_label')}:
        </Text>
        <IdentitiesTileText>{group.urn}</IdentitiesTileText>
      </div>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesGroupTile;
