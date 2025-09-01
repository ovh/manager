import React, { Dispatch, SetStateAction } from 'react';
import {
  OdsToggle,
  OdsText,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

type IdentitiesRootAccountProps = {
  isRootAccount: boolean;
  setIsRootAccount: Dispatch<SetStateAction<boolean>>;
};

const IdentitiesRootAccount = ({
  isRootAccount,
  setIsRootAccount,
}: IdentitiesRootAccountProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { trackClick } = useOvhTracking();

  return (
    <OdsFormField>
      <div className="flex items-center gap-3">
        <OdsToggle
          name="rootAccount"
          id="rootAccount"
          defaultChecked={isRootAccount}
          onOdsChange={(event) => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['toggle_root_identity', !isRootAccount ? 'on' : 'off'],
            });
            setIsRootAccount(event.detail.value);
          }}
        />
        <label htmlFor="rootAccount" slot="label">
          <OdsText>
            {t(
              'key_management_service_credential_create_identities_root_account_toggle_label',
            )}
          </OdsText>
        </label>
      </div>

      <OdsText preset={ODS_TEXT_PRESET.caption}>
        {t(
          'key_management_service_credential_create_identities_root_account_toggle_helper',
        )}
      </OdsText>
    </OdsFormField>
  );
};

export default IdentitiesRootAccount;
