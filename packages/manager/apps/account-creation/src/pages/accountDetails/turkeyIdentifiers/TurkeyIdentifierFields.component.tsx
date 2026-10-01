import { useTranslation } from 'react-i18next';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  OdsFormField,
  OdsInput,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Rule, RuleField } from '@/types/rule';
import {
  KDV_CHOICES,
  KdvChoice,
  TurkeyIdentifier,
  turkeyCninKind,
  turkeyErrorKey,
  TURKEY_COUNTRY,
} from '@/helpers/turkeyHelper';

type TurkeyIdentifierFieldsProps = {
  // The page form: its value type is the rules-driven zod schema.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  /** The API rules: each identifier is shown only when its rule is returned. */
  rules?: Record<RuleField, Rule>;
  /** `corporation | association | administration`. */
  legalForm?: string;
  kdvChoice?: KdvChoice;
  /** The derived KDV (the VKN, or `''`), shown read-only. */
  vat: string;
};

/**
 * Türkiye — at the top of the legal block, in this order: VKN, the KDV choice
 * (no default, required), the read-only KDV when the organisation has one, then
 * the MERSİS No or, for a public administration, the DETSİS No. Each one only
 * when the API returns its rule, mandatory as the rule says (the KDV choice
 * follows the `vat` rule). The checks live in `turkeyHelper`.
 */
export default function TurkeyIdentifierFields({
  control,
  errors,
  rules,
  legalForm,
  kdvChoice,
  vat,
}: TurkeyIdentifierFieldsProps) {
  const { t } = useTranslation(['account-details', NAMESPACES.FORM]);
  const cninKind = turkeyCninKind(TURKEY_COUNTRY, legalForm) ?? 'mersis';

  const errorText = (
    name: string,
    identifier: TurkeyIdentifier,
  ): string | undefined => {
    const message = errors[name]?.message as string | undefined;
    if (!message) return undefined;
    const key = turkeyErrorKey(message, identifier);
    return key ? t(key) : t(message, { ns: NAMESPACES.FORM });
  };

  const identifierField = (
    name:
      | 'nationalIdentificationNumber'
      | 'companyNationalIdentificationNumber',
    identifier: TurkeyIdentifier,
  ) => {
    const rule = rules?.[name as RuleField];
    if (!rule) return null;
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => {
          const label = t(`account_details_field_${identifier}`);
          const error = errorText(name, identifier);
          return (
            <OdsFormField>
              <label htmlFor={name} slot="label" aria-label={label}>
                <OdsText preset="caption">
                  {label}
                  {rule.mandatory && ' *'}
                </OdsText>
              </label>
              <OdsInput
                name={name}
                id={name}
                value={value ?? ''}
                hasError={!!error}
                onOdsChange={onChange}
                onOdsBlur={onBlur}
              />
              {error && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {error}
                </OdsText>
              )}
            </OdsFormField>
          );
        }}
      />
    );
  };

  const kdvError = errorText('kdvChoice', 'vkn');

  return (
    <>
      {identifierField('nationalIdentificationNumber', 'vkn')}

      {rules?.vat && (
        <Controller
          control={control}
          name="kdvChoice"
          render={({ field }) => (
            <OdsFormField>
              <div slot="label">
                <OdsText preset="caption">
                  {t('account_details_field_kdv')}
                  {' *'}
                </OdsText>
              </div>
              <div className="w-full flex flex-col gap-2 mb-4">
                {KDV_CHOICES.map((choice) => (
                  <div key={choice} className="flex leading-none gap-4">
                    <OdsRadio
                      name={field.name}
                      inputId={`kdvChoice_${choice}`}
                      value={choice}
                      isChecked={field.value === choice}
                      hasError={!!kdvError}
                      onOdsChange={field.onChange}
                      className="cursor-pointer"
                    ></OdsRadio>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      <label htmlFor={`kdvChoice_${choice}`}>
                        {t(`account_details_kdv_${choice}_${legalForm}`)}
                      </label>
                    </OdsText>
                  </div>
                ))}
              </div>
              {kdvError && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {kdvError}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />
      )}

      {/* Read-only: it follows the VKN as it is typed, and stays empty while the
          VKN is empty or refused. */}
      {rules?.vat && kdvChoice === 'has' && (
        <OdsFormField>
          <label
            htmlFor="kdv"
            slot="label"
            aria-label={t('account_details_field_kdv')}
          >
            <OdsText preset="caption">{t('account_details_field_kdv')}</OdsText>
          </label>
          <OdsInput name="kdv" id="kdv" value={vat} isReadonly />
          <OdsText preset="caption">{t('account_details_hint_kdv')}</OdsText>
        </OdsFormField>
      )}

      {identifierField('companyNationalIdentificationNumber', cninKind)}
    </>
  );
}
