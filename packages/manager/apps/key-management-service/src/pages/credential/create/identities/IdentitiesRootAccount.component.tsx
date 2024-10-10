import React, { Dispatch, SetStateAction } from 'react';
import {
  OsdsToggle,
  OsdsText,
  OsdsFormField,
  OsdsCheckbox,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

type IdentitiesRootAccountProps = {
  isRootAccount: boolean;
  setIsRootAccount: Dispatch<SetStateAction<boolean>>;
};

const IdentitiesRootAccount = ({
  isRootAccount,
  setIsRootAccount,
}: IdentitiesRootAccountProps) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <OsdsFormField inline>
      <OsdsCheckbox
        checked={isRootAccount}
        onOdsCheckedChange={() => {
          setIsRootAccount(!isRootAccount);
        }}
      >
        <OsdsToggle>
          <OsdsText
            slot="end"
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            className="pl-3"
          >
            {t(
              'key_management_service_credential_create_identities_root_account_toggle_label',
            )}
          </OsdsText>
        </OsdsToggle>
      </OsdsCheckbox>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="helper">
        {t(
          'key_management_service_credential_create_identities_root_account_toggle_helper',
        )}
      </OsdsText>
    </OsdsFormField>
  );
};

export default IdentitiesRootAccount;
