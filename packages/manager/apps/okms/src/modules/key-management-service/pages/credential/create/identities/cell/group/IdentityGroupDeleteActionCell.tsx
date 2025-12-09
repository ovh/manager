import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityGroup } from '@key-management-service/types/identity.type';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

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
