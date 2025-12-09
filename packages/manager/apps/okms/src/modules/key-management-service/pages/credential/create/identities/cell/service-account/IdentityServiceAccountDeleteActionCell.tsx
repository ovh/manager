import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

const IdentityServiceAccountDeleteActionCell = (serviceAccount: IdentityOauthClient) => {
  const { setServiceAccountList } = useIdentityData();

  return (
    <OdsButton
      color={ODS_BUTTON_COLOR.primary}
      variant={ODS_BUTTON_VARIANT.ghost}
      onClick={() => {
        setServiceAccountList((prevServiceAccountList) =>
          prevServiceAccountList.filter(
            (serviceAccountInList) => serviceAccountInList.identity !== serviceAccount.identity,
          ),
        );
      }}
      icon={ODS_ICON_NAME.trash}
      label=""
    />
  );
};

export default IdentityServiceAccountDeleteActionCell;
