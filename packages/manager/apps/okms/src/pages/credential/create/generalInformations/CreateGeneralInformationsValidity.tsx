import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  OdsDatepicker,
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
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

  const getValidityErrorMessage = (
    error: ValidityPeriodErrorsType | undefined,
  ) => {
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
        return undefined;
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
    <>
      <OdsFormField>
        <div slot="label" className="space-y-2 mb-2">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
            {t(
              'key_management_service_credential_create_general_information_validity_title',
            )}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t(
              'key_management_service_credential_create_general_information_validity_subtitle',
            )}
          </OdsText>
        </div>
        <OdsSelect
          name="validity-period"
          data-testid="input-validity-period"
          onOdsChange={(v) => setValidityPresetPeriod(Number(v.detail.value))}
          defaultValue={validityPresetPeriod.toString()}
        >
          {VALIDITY_PERIOD_PRESET.map((validityEntry) => (
            <option value={validityEntry.days} key={validityEntry.days}>
              {t(validityEntry.label)}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
      {validityPresetPeriod === -1 && (
        <OdsFormField error={getValidityErrorMessage(credentialValidityError)}>
          <OdsText slot="label" preset={ODS_TEXT_PRESET.heading5}>
            {t(
              'key_management_service_credential_create_validity_custom_date_label',
            )}
          </OdsText>
          <OdsDatepicker
            name="credentialValidity"
            hasError={!!credentialValidityError}
            value={validityDatepicker}
            onOdsChange={(v) => {
              if (!v.detail.value) return;
              setValidityDatepicker(v.detail.value);
            }}
            max={addDaysToDate(365)}
            min={addDaysToDate(1)}
          />
          <OdsText slot="visual-hint" preset={ODS_TEXT_PRESET.span}>
            {t(
              'key_management_service_credential_update_validity_error_max_period',
            )}
          </OdsText>
        </OdsFormField>
      )}
    </>
  );
};

export default CreateGeneralInformationsValidity;
