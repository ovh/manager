import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';

import { Icon } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

const IdentityServiceAccountDeleteActionCell = (serviceAccount: IdentityOauthClient) => {
  const { setServiceAccountList } = useIdentityData();

  return (
    <Button
      color="critical"
      size="sm"
      onClick={() => {
        setServiceAccountList((prevServiceAccountList) =>
          prevServiceAccountList.filter(
            (serviceAccountInList) => serviceAccountInList.identity !== serviceAccount.identity,
          ),
        );
      }}
    >
      <Icon name="trash" />
    </Button>
  );
};

export default IdentityServiceAccountDeleteActionCell;
