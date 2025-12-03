import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityUser } from '@key-management-service/types/identity.type';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

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
