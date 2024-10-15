import React, { Dispatch, SetStateAction } from 'react';
import { CommonTitle } from '@ovh-ux/manager-react-components';
import {
  OsdsFormField,
  OsdsText,
  OsdsTextarea,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_LEVEL,
  OdsTextAreaValueChangeEvent,
  OsdsTextareaCustomEvent,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  CredentialDescriptionErrorsType,
  CredentialDescriptionMaxCharacters,
} from '@/utils/credential/validateCredentialDescription';

type CreateGeneralInformationsDescriptionProps = {
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  credentialDescriptionError: CredentialDescriptionErrorsType | undefined;
};

const CreateGeneralInformationsDescription = ({
  description,
  setDescription,
  credentialDescriptionError,
}: CreateGeneralInformationsDescriptionProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getDescriptionErrorMessage = (
    error: CredentialDescriptionErrorsType,
  ) => {
    switch (error) {
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_credential_update_description_error_invalid_characters',
        );
      case 'TOO_MANY_CHARACTERS':
        return t(
          'key_management_service_credential_update_description_error_max',
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <CommonTitle>
        {t(
          'key_management_service_credential_create_general_information_description_title',
        )}
      </CommonTitle>
      <OsdsFormField
        error={getDescriptionErrorMessage(credentialDescriptionError)}
      >
        <OsdsTextarea
          value={description || ''}
          error={!!credentialDescriptionError || undefined}
          onOdsValueChange={(
            e: OsdsTextareaCustomEvent<OdsTextAreaValueChangeEvent>,
          ) => {
            return setDescription(e.detail.value);
          }}
        ></OsdsTextarea>
        <OsdsText
          slot="helper"
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          className="text-right"
        >
          {description?.length || 0}/{CredentialDescriptionMaxCharacters}
        </OsdsText>
      </OsdsFormField>
    </div>
  );
};

export default CreateGeneralInformationsDescription;
