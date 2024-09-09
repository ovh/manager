import { CommonTitle, Description } from '@ovh-ux/manager-react-components';
import {
  OsdsDatepicker,
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VALIDITY_PERIOD_PRESET } from '../CreateGeneralInformations.constants';
import { ValidityPeriodErrorsType } from '@/utils/credential/validateValidityDate';
import {
  getDaysFromDate,
  getNextMonth,
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
  const [validityPresetPeriod, setValidityPresetPeriod] = useState(validity);
  const [validityDatepicker, setValidityDatepicker] = useState<Date>(
    getNextMonth(),
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
          ></OsdsDatepicker>
          <OsdsText slot="label">
            {t(
              'key_management_service_credential_create_validity_custom_date_label',
            )}
          </OsdsText>
        </OsdsFormField>
      )}
    </div>
  );
};

export default CreateGeneralInformationsValidity;
