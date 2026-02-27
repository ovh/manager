import { Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Text,
  Toggle,
  ToggleControl,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

type IdentitiesRootAccountToggleProps = {
  isRootAccount: boolean;
  setIsRootAccount: Dispatch<SetStateAction<boolean>>;
};

export const IdentitiesRootAccountToggle = ({
  isRootAccount,
  setIsRootAccount,
}: IdentitiesRootAccountToggleProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { trackClick } = useOkmsTracking();

  return (
    <FormField>
      <Toggle
        checked={isRootAccount}
        onCheckedChange={(detail) => {
          const newValue = !!detail.checked;
          trackClick({
            location: PageLocation.funnel,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['toggle', 'root-identity', newValue ? 'on' : 'off'],
          });
          setIsRootAccount(newValue);
        }}
      >
        <ToggleControl />
        <FormFieldLabel>
          {t('key_management_service_credential_create_identities_root_account_toggle_label')}
        </FormFieldLabel>
      </Toggle>
      <FormFieldHelper>
        <Text preset="caption">
          {t('key_management_service_credential_create_identities_root_account_toggle_helper')}
        </Text>
      </FormFieldHelper>
    </FormField>
  );
};
