import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { IdentityOauthClient } from '@/types/identity.type';
import { useIdentityData } from '@/hooks/credential/useIdentityData';

const IdentityServiceAccountDeleteActionCell = (
  serviceAccount: IdentityOauthClient,
) => {
  const { setServiceAccountList } = useIdentityData();

  return (
    <OsdsButton
      circle
      variant={ODS_BUTTON_VARIANT.ghost}
      onClick={() => {
        setServiceAccountList((prevServiceAccountList) =>
          prevServiceAccountList.filter(
            (serviceAccountInList) =>
              serviceAccountInList.identity !== serviceAccount.identity,
          ),
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

export default IdentityServiceAccountDeleteActionCell;
