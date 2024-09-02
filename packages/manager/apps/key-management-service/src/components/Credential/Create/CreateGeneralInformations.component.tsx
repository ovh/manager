import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  CommonTitle,
  Description,
  Subtitle,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsDatepicker,
  OsdsFormField,
  OsdsInput,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
  OsdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  OdsInputValueChangeEventDetail,
  OdsTextAreaValueChangeEvent,
  OsdsInputCustomEvent,
  OsdsTextareaCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';
import {
  CredentialNameErrorsType,
  validateCredentialName,
} from '@/utils/credential/validateCredentialName';
import {
  CredentialDescriptionErrorsType,
  CredentialDescriptionMaxCharacters,
  validateCredentialDescription,
} from '@/utils/credential/validateCredentialDescription';
import {
  getDaysFromDate,
  getNextMonth,
} from '@/utils/credential/validityDateUtils';
import {
  ValidityPeriodErrorsType,
  validateValidityDate,
} from '@/utils/credential/validateValidityDate';

const ValidityPeriod = [
  {
    label:
      'key_management_service_credential_create_general_validity_period_day',
    days: 1,
  },
  {
    label:
      'key_management_service_credential_create_general_validity_period_week',
    days: 7,
  },
  {
    label:
      'key_management_service_credential_create_general_validity_period_month',
    days: 30,
  },
  {
    label:
      'key_management_service_credential_create_general_validity_period_3months',
    days: 90,
  },
  {
    label:
      'key_management_service_credential_create_general_validity_period_6months',
    days: 183,
  },
  {
    label:
      'key_management_service_credential_create_general_validity_period_year',
    days: 365,
  },
  {
    label:
      'key_management_service_credential_create_general_validity_period_custom',
    days: -1,
  },
];

type CreateGeneralInformationsProps = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  validity: number;
  setValidity: Dispatch<SetStateAction<number>>;
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  csr: string | null;
  setCsr: Dispatch<SetStateAction<string | null>>;
};

const CreateGeneralInformations = ({
  name,
  setName,
  validity,
  setValidity,
  description,
  setDescription,
  csr,
  setCsr,
}: CreateGeneralInformationsProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const [isCustomCsr, setIsCustomCsr] = useState<boolean>(false);
  const credentialNameError = validateCredentialName(name);
  const credentialDescriptionError = validateCredentialDescription(description);
  const credentialValidityError = validateValidityDate(validity);
  const [validityDatepicker, setValidityDatepicker] = useState<Date>(
    getNextMonth(),
  );
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

  const getValidityErrorMessage = (error: ValidityPeriodErrorsType) => {
    switch (error) {
      case 'MIN_PERIOD':
        return t(
          'key_management_service_credential_update_validity_error_min_period',
        );
      case 'MAX_PERIOD':
        return t(
          'key_management_service_credential_update_validity_error_max_period',
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-7 md:gap-9">
      <div className="flex flex-col gap-6 md:gap-8">
        <Subtitle>
          {t(
            'key_management_service_credential_create_general_information_title',
          )}
        </Subtitle>
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
              className="p-3"
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
            <OsdsText slot="helper">
              {description?.length || 0}/{CredentialDescriptionMaxCharacters}
            </OsdsText>
          </OsdsFormField>
        </div>
        <div className="flex flex-col gap-5 md:gap-6">
          <CommonTitle>
            {t(
              'key_management_service_credential_create_general_information_validity_title',
            )}
          </CommonTitle>
          <Description>
            {t(
              'key_management_service_credential_create_general_information_validity_subtitle',
            )}
          </Description>
          <OsdsSelect
            value={validity}
            onOdsValueChange={(v) => {
              return setValidity(Number(v.detail.value));
            }}
          >
            {ValidityPeriod.map((validityEntry) => (
              <OsdsSelectOption
                value={validityEntry.days}
                key={validityEntry.days}
              >
                {t(validityEntry.label)}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
          {(validity === -1 ||
            !ValidityPeriod.some((period) => period.days === validity)) && (
            <OsdsFormField
              error={getValidityErrorMessage(credentialValidityError)}
            >
              <OsdsDatepicker
                error={!!credentialValidityError || undefined}
                value={validityDatepicker}
                onOdsDatepickerValueChange={(v) => {
                  setValidityDatepicker(v.detail.value);
                  setValidity(getDaysFromDate(v.detail.value));
                }}
              ></OsdsDatepicker>
            </OsdsFormField>
          )}
        </div>
        <Subtitle>
          {t(
            'key_management_service_credential_create_general_creation_method_title',
          )}
        </Subtitle>
        <div className="flex flex-col gap-5 md:gap-6">
          <Description>
            {t(
              'key_management_service_credential_create_general_information_creation_method_subtitle',
            )}
          </Description>
          <OsdsRadioGroup className="flex flex-col gap-6">
            <OsdsRadio checked={!isCustomCsr}>
              <OsdsRadioButton
                size={ODS_RADIO_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => setIsCustomCsr(false)}
              >
                <span slot="end">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  >
                    {t(
                      'key_management_service_credential_create_general_information_creation_method_no_key',
                    )}
                  </OsdsText>
                  <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                    {t(
                      `key_management_service_credential_create_general_information_creation_method_no_key_desc`,
                    )}
                  </OsdsText>
                </span>
              </OsdsRadioButton>
            </OsdsRadio>
            <OsdsRadio checked={isCustomCsr}>
              <OsdsRadioButton
                size={ODS_RADIO_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => setIsCustomCsr(true)}
              >
                <span slot="end">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  >
                    {t(
                      'key_management_service_credential_create_general_information_creation_method_key',
                    )}
                  </OsdsText>
                  <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                    {t(
                      `key_management_service_credential_create_general_information_creation_method_key_desc`,
                    )}
                  </OsdsText>
                </span>
              </OsdsRadioButton>
            </OsdsRadio>
          </OsdsRadioGroup>
          {isCustomCsr && (
            <>
              <Subtitle>
                {t(
                  'key_management_service_credential_create_general_information_csr_title',
                )}
              </Subtitle>
              <CommonTitle>
                {t(
                  'key_management_service_credential_create_general_information_csr_subtitle',
                )}
              </CommonTitle>
              <OsdsTextarea
                value={csr}
                onOdsValueChange={(
                  e: OsdsTextareaCustomEvent<OdsTextAreaValueChangeEvent>,
                ) => {
                  return setCsr(e.detail.value);
                }}
              ></OsdsTextarea>
            </>
          )}
        </div>
        <div className="flex gap-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.md}
            inline
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => {
              navigate(`/${okmsId}${ROUTES_URLS.credentials}`);
            }}
          >
            {t('key_management_service_credential_create_cta_cancel')}
          </OsdsButton>
          <OsdsButton
            size={ODS_BUTTON_SIZE.md}
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            disabled={
              !!credentialNameError ||
              !!credentialDescriptionError ||
              !!credentialValidityError ||
              undefined
            }
          >
            {t('key_management_service_credential_create_cta_add_identities')}
          </OsdsButton>
        </div>
      </div>
    </div>
  );
};

export default CreateGeneralInformations;
