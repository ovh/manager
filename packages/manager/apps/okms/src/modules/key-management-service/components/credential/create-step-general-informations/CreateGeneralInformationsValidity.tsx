import { useEffect, useState } from 'react';

import { ValidityPeriodErrorsType } from '@key-management-service/utils/credential/validateValidityDate';
import {
  addDaysToDate,
  getDateFromDays,
  getDaysFromDate,
} from '@key-management-service/utils/credential/validityDateUtils';
import { useTranslation } from 'react-i18next';

import {
  Datepicker,
  DatepickerContent,
  DatepickerControl,
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';

import { VALIDITY_PERIOD_PRESET } from './CreateGeneralInformations.constants';

type CreateGeneralInformationsValidityProps = {
  validity: number;
  setValidity: (validity: number) => void;
  credentialValidityError: ValidityPeriodErrorsType | undefined;
};

export const CreateGeneralInformationsValidity = ({
  validity,
  setValidity,
  credentialValidityError,
}: CreateGeneralInformationsValidityProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getPresetForDays = (days: number): number =>
    VALIDITY_PERIOD_PRESET.find((preset) => preset.days === days)?.days ?? -1;

  const [validityPresetPeriod, setValidityPresetPeriod] = useState(getPresetForDays(validity));
  const [validityDatepicker, setValidityDatepicker] = useState<Date>(getDateFromDays(validity));

  const getValidityErrorMessage = (error: ValidityPeriodErrorsType | undefined) => {
    switch (error) {
      case 'MIN_PERIOD':
        return t('key_management_service_credential_update_validity_error_min_period');
      case 'MAX_PERIOD':
        return t('key_management_service_credential_update_validity_error_max_period');
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
  }, [validityPresetPeriod, validityDatepicker, setValidity]);

  return (
    <div className="flex flex-col gap-4">
      {/* Select to select the validity period preset */}
      <FormField>
        <FormFieldLabel>
          <div className="mb-2 space-y-2">
            <Text className="block" preset="heading-5">
              {t('key_management_service_credential_create_general_information_validity_title')}
            </Text>
            <Text preset="paragraph">
              {t('key_management_service_credential_create_general_information_validity_subtitle')}
            </Text>
          </div>
        </FormFieldLabel>
        <Select
          name="validity-period"
          data-testid="input-validity-period"
          onValueChange={(detail) => setValidityPresetPeriod(Number(detail.value[0]))}
          defaultValue={validityPresetPeriod !== -1 ? validityPresetPeriod.toString() : undefined}
          items={VALIDITY_PERIOD_PRESET.map((validityEntry) => ({
            label: t(validityEntry.label),
            value: validityEntry.days.toString(),
          }))}
        >
          <SelectControl />
          <SelectContent />
        </Select>
      </FormField>

      {/* Datepicker to select the validity period custom date */}
      {validityPresetPeriod === -1 && (
        <FormField invalid={!!credentialValidityError}>
          <FormFieldLabel>
            <Text preset="heading-5">
              {t('key_management_service_credential_create_validity_custom_date_label')}
            </Text>
          </FormFieldLabel>
          <Datepicker
            name="credentialValidity"
            invalid={!!credentialValidityError}
            value={validityDatepicker}
            onValueChange={(detail) => {
              if (!detail.value) return;
              setValidityDatepicker(detail.value);
            }}
            max={addDaysToDate(365)}
            min={addDaysToDate(1)}
          >
            <DatepickerControl />
            <DatepickerContent />
          </Datepicker>
          <FormFieldHelper>
            <Text preset="span">
              {t('key_management_service_credential_update_validity_error_max_period')}
            </Text>
          </FormFieldHelper>
          {getValidityErrorMessage(credentialValidityError) && (
            <FormFieldError>{getValidityErrorMessage(credentialValidityError)}</FormFieldError>
          )}
        </FormField>
      )}
    </div>
  );
};
