import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityUser } from '@key-management-service/types/identity.type';

import { Icon } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

const IdentityUserDeleteActionCell = (user: IdentityUser) => {
  const { setUserList } = useIdentityData();

  return (
    <Button
      color="critical"
      size="sm"
      onClick={() => {
        setUserList((prevUserList) =>
          prevUserList.filter((userInList) => userInList.urn !== user.urn),
        );
      }}
    >
      <Icon name="trash" />
    </Button>
  );
};

export default IdentityUserDeleteActionCell;
