import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
import { IdentityGroup } from '@/types/identity.type';
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
    if (
      selectedGroupList.some((groupInList) => groupInList.urn === group.urn)
    ) {
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
      urn={group.urn}
      title={group.name}
      updateCallback={updateGroupInList}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    >
      <span>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
          {t(
            'key_management_service_credential_create_identities_group_tile_description_label',
          )}
          :
        </OsdsText>
        <IdentitiesTileText>{group.description}</IdentitiesTileText>
      </span>
      <span>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text}>
          {t(
            'key_management_service_credential_create_identities_group_tile_identity_label',
          )}
          :
        </OsdsText>
        <IdentitiesTileText>{group.urn}</IdentitiesTileText>
      </span>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesGroupTile;
