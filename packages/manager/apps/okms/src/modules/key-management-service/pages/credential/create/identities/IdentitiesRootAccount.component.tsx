import { Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsToggle } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

type IdentitiesRootAccountProps = {
  isRootAccount: boolean;
  setIsRootAccount: Dispatch<SetStateAction<boolean>>;
};

const IdentitiesRootAccount = ({ isRootAccount, setIsRootAccount }: IdentitiesRootAccountProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { trackClick } = useOkmsTracking();

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
              actions: ['toggle', 'root-identity', !isRootAccount ? 'on' : 'off'],
            });
            setIsRootAccount(event.detail.value);
          }}
        />
        <label htmlFor="rootAccount" slot="label">
          <Text>
            {t('key_management_service_credential_create_identities_root_account_toggle_label')}
          </Text>
        </label>
      </div>

      <Text preset="caption">
        {t('key_management_service_credential_create_identities_root_account_toggle_helper')}
      </Text>
    </OdsFormField>
  );
};

export default IdentitiesRootAccount;
