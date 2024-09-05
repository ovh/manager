import { CommonTitle, Description } from '@ovhcloud/manager-components';
import {
  ODS_INPUT_TYPE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import { OsdsFormField, OsdsInput } from '@ovhcloud/ods-components/react';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { CredentialNameErrorsType } from '@/utils/credential/validateCredentialName';

type CreateGeneralInformationsNameProps = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  credentialNameError: CredentialNameErrorsType | undefined;
};

const CreateGeneralInformationsName = ({
  name,
  setName,
  credentialNameError,
}: CreateGeneralInformationsNameProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getNameErrorMessage = (error: CredentialNameErrorsType) => {
    switch (error) {
      case 'REQUIRED':
        return t(
          'key_management_service_credential_update_name_error_required',
        );
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_credential_update_name_error_invalid_characters',
        );
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_credential_update_name_error_max');

      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <CommonTitle>
        {t(
          'key_management_service_credential_create_general_information_display_name_title',
        )}
      </CommonTitle>
      <Description>
        {t(
          'key_management_service_credential_create_general_information_display_name_subtitle',
        )}
      </Description>
      <OsdsFormField error={getNameErrorMessage(credentialNameError)}>
        <OsdsInput
          aria-label="input-service-key-name"
          type={ODS_INPUT_TYPE.text}
          error={!!credentialNameError}
          required
          placeholder={t(
            'key_management_service_credential_create_general_information_display_name_placeholder',
          )}
          value={name}
          onOdsValueChange={(
            e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
          ) => {
            return setName(e.detail.value);
          }}
        />
      </OsdsFormField>
    </div>
  );
};

export default CreateGeneralInformationsName;
