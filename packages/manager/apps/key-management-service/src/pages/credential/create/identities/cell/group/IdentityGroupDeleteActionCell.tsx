import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { IdentityGroup } from '@/types/identity.type';

const IdentityGroupDeleteActionCell = (group: IdentityGroup) => {
  const { setGroupList } = useIdentityData();

  return (
    <OdsButton
      color={ODS_BUTTON_COLOR.primary}
      variant={ODS_BUTTON_VARIANT.ghost}
      onClick={() => {
        setGroupList((prevGroupList) =>
          prevGroupList.filter((groupInList) => groupInList.urn !== group.urn),
        );
      }}
      icon={ODS_ICON_NAME.trash}
      label=""
    />
  );
};

export default IdentityGroupDeleteActionCell;
