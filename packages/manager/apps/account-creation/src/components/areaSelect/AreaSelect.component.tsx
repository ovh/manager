import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { AreaSelectProps } from '@/types/area';

export default function AreaSelect({
  name,
  value,
  onChange,
  onBlur,
  country,
  area,
  error,
  disabled,
  isLoading,
  defaultValue,
}: AreaSelectProps) {
  const namespaces =  NAMESPACES.AREA[country];
  const { t } = useTranslation([
    'account-details',
    namespaces,
  ]);

  const label = useMemo(() => {
    if (
      country &&
      ['AU', 'US', 'IN'].includes(country)
    )
      return 'state';
    return country === 'CA' ? 'province' : 'area';
  }, [country]);

  if (!area.in?.length) {
    return null;
  }

  return (
    <OdsFormField className="w-full">
      <OdsText preset="caption" aria-label={t('account_details_field_area')}>
        <label htmlFor={name}>
          {t(`account_details_field_${label}`)}
          {area.mandatory && ' *'}
        </label>
      </OdsText>

      {!isLoading && (<OdsSelect
        name={name}
        value={value}
        onOdsChange={onChange}
        onOdsBlur={onBlur}
        isDisabled={disabled}
        hasError={!!error}
        className="flex-1"
        defaultValue={defaultValue}
      >
        {area.in.map((item: string) => (
          <option key={item} value={item}>
            {t(item, { ns: namespaces })}
          </option>
        ))}
      </OdsSelect>)}

      {error && area && (
        <OdsText
          className="text-critical leading-[0.8]"
          preset="caption"
        >
          {error}
        </OdsText>
      )}
    </OdsFormField>
  );
}
