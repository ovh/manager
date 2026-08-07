import React, { useState } from 'react';

import { Control, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsSelect } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { FieldError } from '@/components/FieldError/FieldError.component';
import { Location } from '@/types/Location.type';
import {
  formatCityOptionLabel,
  formatCountryTitle,
  selectCountries,
  selectLocationsByCountry,
} from '@/utils/locationLabel/locationLabel';

import { VaultOrderFormValues } from '../_hooks/useVaultOrderForm.hook';

export const VAULT_ORDER_COUNTRY_FIELD_ID = 'vault-order-country';
export const VAULT_ORDER_REGION_FIELD_ID = 'vault-order-region';

export const VaultRegionField = ({
  control,
  isDisabled,
  locations,
}: {
  control: Control<VaultOrderFormValues>;
  isDisabled: boolean;
  locations: Location[];
}) => {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.VAULTS, NAMESPACES.ACTIONS]);
  const [countryCode, setCountryCode] = useState('');
  const {
    field: { ref: registerControl, ...field },
    fieldState: { error },
  } = useController({ control, name: 'region' });

  const label = t('order.field.region.label');
  const countryLabel = t('order.field.country.label');
  const placeholder = t(`${NAMESPACES.ACTIONS}:select_imperative`);
  const countries = selectCountries(locations);
  const cities = selectLocationsByCountry(locations, countryCode);

  const onCountryChange = (nextCountryCode: string) => {
    setCountryCode(nextCountryCode);
    field.onChange('');
  };

  const countryLabelElement = (
    <label htmlFor={VAULT_ORDER_COUNTRY_FIELD_ID} slot="label">
      {countryLabel}
    </label>
  );

  const regionLabelElement = (
    <label htmlFor={VAULT_ORDER_REGION_FIELD_ID} slot="label">
      {label}
      <span aria-hidden="true" className="ml-1 text-[var(--ods-color-critical-500)]">
        *
      </span>
    </label>
  );

  return (
    <div className="flex flex-col gap-4">
      <OdsFormField className="block">
        {countryLabelElement}
        <OdsSelect
          id={VAULT_ORDER_COUNTRY_FIELD_ID}
          name="country"
          value={countryCode}
          placeholder={placeholder}
          ariaLabel={countryLabel}
          isDisabled={isDisabled}
          onOdsChange={(event) => onCountryChange(String(event.detail.value ?? ''))}
        >
          {countries.map((country) => (
            <option key={country.countryCode} value={country.countryCode}>
              {formatCountryTitle(country)}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>

      <OdsFormField className="block">
        {regionLabelElement}
        <OdsSelect
          key={countryCode}
          ref={registerControl}
          id={VAULT_ORDER_REGION_FIELD_ID}
          name={field.name}
          value={field.value}
          placeholder={placeholder}
          ariaLabel={error?.message ? `${label}, ${t(error.message)}` : label}
          hasError={!!error}
          isDisabled={isDisabled || !countryCode}
          isRequired
          onOdsChange={(event) => field.onChange(String(event.detail.value ?? ''))}
          onOdsBlur={field.onBlur}
        >
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {formatCityOptionLabel(city)}
            </option>
          ))}
        </OdsSelect>
        <FieldError
          fieldId={VAULT_ORDER_REGION_FIELD_ID}
          message={error?.message && t(error.message)}
        />
      </OdsFormField>
    </div>
  );
};
