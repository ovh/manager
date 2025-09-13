import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
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
      title={group.name}
      updateCallback={updateGroupInList}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    >
      <div>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            'key_management_service_credential_create_identities_group_tile_description_label',
          )}
          :
        </OdsText>
        <IdentitiesTileText>{group.description}</IdentitiesTileText>
      </div>
      <div>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            'key_management_service_credential_create_identities_group_tile_identity_label',
          )}
          :
        </OdsText>
        <IdentitiesTileText>{group.urn}</IdentitiesTileText>
      </div>
    </IdentitiesBaseTile>
  );
};

export default IdentitiesGroupTile;
