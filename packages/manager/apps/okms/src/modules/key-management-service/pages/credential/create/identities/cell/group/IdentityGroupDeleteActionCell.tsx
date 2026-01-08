import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityGroup } from '@key-management-service/types/identity.type';

import { Icon } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

const IdentityGroupDeleteActionCell = (group: IdentityGroup) => {
  const { setGroupList } = useIdentityData();

  return (
    <Button
      color="critical"
      size="sm"
      onClick={() => {
        setGroupList((prevGroupList) =>
          prevGroupList.filter((groupInList) => groupInList.urn !== group.urn),
        );
      }}
    >
      <Icon name="trash" />
    </Button>
  );
};

export default IdentityGroupDeleteActionCell;
