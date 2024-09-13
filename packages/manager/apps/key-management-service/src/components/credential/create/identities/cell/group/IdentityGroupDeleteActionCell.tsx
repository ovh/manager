import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useIdentityData } from '@/hooks/credential/useIdentityData';
import { IdentityGroup } from '@/types/identity.type';

const IdentityGroupDeleteActionCell = (group: IdentityGroup) => {
  const { setGroupList } = useIdentityData();

  return (
    <OsdsButton
      circle
      variant={ODS_BUTTON_VARIANT.ghost}
      onClick={() => {
        setGroupList((prevGroupList) =>
          prevGroupList.filter((groupInList) => groupInList.urn !== group.urn),
        );
      }}
    >
      <OsdsIcon
        name={ODS_ICON_NAME.TRASH}
        size={ODS_ICON_SIZE.xs}
        color={ODS_THEME_COLOR_INTENT.primary}
      ></OsdsIcon>
    </OsdsButton>
  );
};

export default IdentityGroupDeleteActionCell;
