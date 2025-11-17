import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useIdentityData } from '@key-management-service/hooks/credential/useIdentityData';
import { IdentityOauthClient } from '@key-management-service/types/identity.type';

const IdentityServiceAccountDeleteActionCell = (
  serviceAccount: IdentityOauthClient,
) => {
  const { setServiceAccountList } = useIdentityData();

  return (
    <OdsButton
      color={ODS_BUTTON_COLOR.primary}
      variant={ODS_BUTTON_VARIANT.ghost}
      onClick={() => {
        setServiceAccountList((prevServiceAccountList) =>
          prevServiceAccountList.filter(
            (serviceAccountInList) =>
              serviceAccountInList.identity !== serviceAccount.identity,
          ),
        );
      }}
      icon={ODS_ICON_NAME.trash}
      label=""
    />
  );
};

export default IdentityServiceAccountDeleteActionCell;
