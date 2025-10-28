import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { IdentityUser } from '@/types/identity.type';
import { useIdentityData } from '@/hooks/credential/useIdentityData';

const IdentityUserDeleteActionCell = (user: IdentityUser) => {
  const { setUserList } = useIdentityData();

  return (
    <OdsButton
      color={ODS_BUTTON_COLOR.primary}
      variant={ODS_BUTTON_VARIANT.ghost}
      onClick={() => {
        setUserList((prevUserList) =>
          prevUserList.filter((userInList) => userInList.urn !== user.urn),
        );
      }}
      icon={ODS_ICON_NAME.trash}
      label=""
    />
  );
};

export default IdentityUserDeleteActionCell;
