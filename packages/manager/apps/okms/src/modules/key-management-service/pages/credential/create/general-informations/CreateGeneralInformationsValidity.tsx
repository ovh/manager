import { useEffect, useState } from 'react';

import { ValidityPeriodErrorsType } from '@key-management-service/utils/credential/validateValidityDate';
import {
  addDaysToDate,
  getDateFromDays,
  getDaysFromDate,
} from '@key-management-service/utils/credential/validityDateUtils';
import { useTranslation } from 'react-i18next';

import { OdsDatepicker, OdsFormField, OdsSelect } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

import { odsSelectValueToValue, valueToOdsSelectValue } from '@/common/utils/ods/odsSelect';

import { VALIDITY_PERIOD_PRESET } from '../CreateGeneralInformations.constants';

type CreateGeneralInformationsValidityProps = {
  validity: number;
  setValidity: (validity: number) => void;
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
    <>
      <OdsFormField>
        <div slot="label" className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_credential_create_general_information_validity_title')}
          </Text>
          <Text preset="paragraph">
            {t('key_management_service_credential_create_general_information_validity_subtitle')}
          </Text>
        </div>
        <OdsSelect
          name="validity-period"
          data-testid="input-validity-period"
          onOdsChange={(v) => setValidityPresetPeriod(odsSelectValueToValue(v.detail.value ?? ''))}
          defaultValue={valueToOdsSelectValue(validityPresetPeriod)}
        >
          {VALIDITY_PERIOD_PRESET.map((validityEntry) => (
            <option value={valueToOdsSelectValue(validityEntry.days)} key={validityEntry.days}>
              {t(validityEntry.label)}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
      {validityPresetPeriod === -1 && (
        <OdsFormField error={getValidityErrorMessage(credentialValidityError)}>
          <Text slot="label" preset="heading-5">
            {t('key_management_service_credential_create_validity_custom_date_label')}
          </Text>
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
          <Text slot="visual-hint" preset="span">
            {t('key_management_service_credential_update_validity_error_max_period')}
          </Text>
        </OdsFormField>
      )}
    </>
  );
};

export default CreateGeneralInformationsValidity;
