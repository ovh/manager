import { CommonTitle, Description } from '@ovh-ux/manager-react-components';
import {
  OsdsDatepicker,
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VALIDITY_PERIOD_PRESET } from '../CreateGeneralInformations.constants';
import { ValidityPeriodErrorsType } from '@/utils/credential/validateValidityDate';
import {
  addDaysToDate,
  getDateFromDays,
  getDaysFromDate,
} from '@/utils/credential/validityDateUtils';

type CreateGeneralInformationsValidityProps = {
  validity: number;
  setValidity: Dispatch<SetStateAction<number>>;
  credentialValidityError: ValidityPeriodErrorsType | undefined;
};

const CreateGeneralInformationsValidity = ({
  validity,
  setValidity,
  credentialValidityError,
}: CreateGeneralInformationsValidityProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getPresetForDays = (days: number): number =>
    VALIDITY_PERIOD_PRESET.find((preset) => preset.days === days)?.days ?? -1;

  const [validityPresetPeriod, setValidityPresetPeriod] = useState(
    getPresetForDays(validity),
  );
  const [validityDatepicker, setValidityDatepicker] = useState<Date>(
    getDateFromDays(validity),
  );

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

  useEffect(() => {
    if (validityPresetPeriod !== -1) {
      setValidity(validityPresetPeriod);
    } else {
      if (!validityDatepicker) return;
      setValidity(getDaysFromDate(validityDatepicker));
    }
  }, [validityPresetPeriod, validityDatepicker]);

  return (
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
        value={validityPresetPeriod}
        onOdsValueChange={(v) => {
          return setValidityPresetPeriod(Number(v.detail.value));
        }}
      >
        {VALIDITY_PERIOD_PRESET.map((validityEntry) => (
          <OsdsSelectOption value={validityEntry.days} key={validityEntry.days}>
            {t(validityEntry.label)}
          </OsdsSelectOption>
        ))}
      </OsdsSelect>
      {validityPresetPeriod === -1 && (
        <OsdsFormField error={getValidityErrorMessage(credentialValidityError)}>
          <OsdsDatepicker
            error={!!credentialValidityError || undefined}
            value={validityDatepicker}
            onOdsDatepickerValueChange={(v) => {
              setValidityDatepicker(v.detail.value);
            }}
            maxDate={addDaysToDate(365)}
            minDate={addDaysToDate(1)}
          ></OsdsDatepicker>
          <OsdsText slot="label" color={ODS_THEME_COLOR_INTENT.text}>
            {t(
              'key_management_service_credential_create_validity_custom_date_label',
            )}
          </OsdsText>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            slot="helper"
          >
            {t(
              'key_management_service_credential_update_validity_error_max_period',
            )}
          </OsdsText>
        </OsdsFormField>
      )}
    </div>
  );
};

export default CreateGeneralInformationsValidity;
