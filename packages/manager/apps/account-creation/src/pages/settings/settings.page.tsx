import { useCallback, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCombobox,
  OdsComboboxItem,
  OdsFormField,
  OdsLink,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Currency } from '@ovh-ux/manager-config';
import {
  ButtonType,
  PageLocation,
  usePageTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useTrackingContext } from '@/context/tracking/useTracking';
import {
  useCountrySettings,
  useCurrencySettings,
  useLanguageSettings,
  useSubsidiarySettings,
} from '@/data/hooks/settings/useSettings';
import { useSettingsSchema } from '@/hooks/settings/useSettings';
import { useTrackError } from '@/hooks/tracking/useTracking';
import { WEBSITE_LABEL_BY_LOCALE } from './settings.constants';

type SettingsFormData = {
  country: string;
  currency: string;
  language: string;
};

export default function Settings() {
  const { t } = useTranslation([
    'settings',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
  const { trackClick } = useTrackingContext();
  const { trackError } = useTrackError('choose-preferences');
  const pageTracking = usePageTracking();

  const schema = useSettingsSchema();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const selectedCountry = watch('country');
  const selectedCurrency = watch('currency');
  const selectedLanguage = watch('language');
  const {
    data: countries,
    isLoading: isLoadingCountries,
    error: errorCountries,
  } = useCountrySettings();
  const { data: currencies, error: errorCurrencies } = useCurrencySettings(
    selectedCountry,
  );
  const { data: languages, error: errorLanguages } = useLanguageSettings(
    selectedCountry,
    selectedCurrency,
  );
  const { data: ovhSubsidiary } = useSubsidiarySettings(
    selectedCountry,
    selectedCurrency,
    selectedLanguage,
  );

  const comboboxRef = useRef<HTMLOdsComboboxElement | null>(null);

  useEffect(() => {
    if (!comboboxRef.current) {
      return;
    }
    const odsInput = comboboxRef.current.shadowRoot?.querySelector('ods-input');
    if (!odsInput) {
      return;
    }
    const input = odsInput.shadowRoot?.querySelector('input');
    if (!input || input.autocomplete === 'off') {
      return;
    }
    input.autocomplete = 'off';
  }, [comboboxRef.current, countries]);

  useEffect(() => {
    if (currencies?.length === 1) {
      setValue('currency', currencies[0].code);
    }
  }, [currencies, selectedCountry]);

  useEffect(() => {
    if (languages?.length === 1) {
      setValue('language', languages[0]);
    }
  }, [languages, selectedCountry, selectedCurrency]);

  useEffect(() => {
    const error = errorCountries || errorCurrencies || errorLanguages;
    if (error) {
      trackError(error.message);
    }
  }, [errorCountries, errorCurrencies, errorLanguages]);

  const resetCurrencyAndLanguage = useCallback(() => {
    setValue('currency', '');
    setValue('language', '');
  }, [setValue]);

  const submitSettings: SubmitHandler<SettingsFormData> = useCallback(
    ({ country, currency, language }: SettingsFormData) => {
      trackClick(pageTracking, {
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actions: [
          'account-creation-choose-preferences',
          'next',
          `${ovhSubsidiary}_${language}`,
        ],
      });
      console.log({ country, currency, language });
    },
    [ovhSubsidiary],
  );

  const trackAuthLinkClick = useCallback(() => {
    trackClick(pageTracking, {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actions: ['login'],
    });
  }, [trackClick, pageTracking]);

  return (
    <div className={'flex flex-col gap-8'}>
      <div className={'flex flex-col gap-5'}>
        <OdsText preset={ODS_TEXT_PRESET.heading1}>{t('title')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="description"
            components={{
              Link: (
                <OdsLink href={'/auth'} onClick={() => trackAuthLinkClick()} />
              ),
            }}
          />
        </OdsText>
      </div>
      <form onSubmit={handleSubmit(submitSettings)} autoComplete="off">
        <Controller
          control={control}
          name="country"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex flex-wrap w-full gap-3 mb-7">
              <label className="block" slot={'label'}>
                {t('country_setting')} *
              </label>
              <OdsCombobox
                name={`country`}
                className="w-full"
                value={value}
                allowNewElement={false}
                onOdsChange={(evt) => {
                  resetCurrencyAndLanguage();
                  onChange(evt);
                }}
                onBlur={onBlur}
                isClearable={true}
                isLoading={isLoadingCountries}
                hasError={!!errors[name]}
                ref={comboboxRef}
                data-testid="country-combobox"
              >
                {countries?.map(({ code, label }) => (
                  <OdsComboboxItem value={code} key={`country_${code}`}>
                    {label}
                  </OdsComboboxItem>
                ))}
              </OdsCombobox>
              {errors[name]?.message && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {t(errors[name].message, { ns: NAMESPACES.FORM })}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="currency"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex flex-wrap w-full gap-3 mb-7">
              <label className="block" slot={'label'}>
                {t('currency_setting')} *
              </label>
              <OdsSelect
                name={`currencies`}
                className="w-full"
                value={value}
                isDisabled={!currencies?.length}
                onOdsChange={onChange}
                onBlur={onBlur}
                key={`currencies_for_${selectedCurrency}`}
                hasError={Boolean(currencies?.length && errors[name])}
                data-testid="currency-select"
              >
                {(currencies || []).map((currency: Currency) => (
                  <option
                    key={`currency_${currency.code}`}
                    value={currency.code}
                  >
                    {`${currency.code} - ${currency.symbol}`}
                  </option>
                ))}
              </OdsSelect>
              {!!currencies?.length && errors[name]?.message && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {t(errors[name].message, { ns: NAMESPACES.FORM })}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="language"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex flex-wrap w-full gap-3 mb-7">
              <label className="block" slot={'label'}>
                {t('site_setting')} *
              </label>
              <OdsSelect
                name={`site`}
                className="w-full"
                value={value}
                isDisabled={!languages?.length}
                onOdsChange={onChange}
                onBlur={onBlur}
                key={`languages_for_${selectedCountry}`}
                hasError={Boolean(languages?.length && errors[name])}
                data-testid="language-select"
              >
                {(languages || []).map((language) => (
                  <option key={`site_${language}`} value={language}>
                    {WEBSITE_LABEL_BY_LOCALE[language]}
                  </option>
                ))}
              </OdsSelect>
              {!!languages?.length && errors[name]?.message && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {t(errors[name].message, { ns: NAMESPACES.FORM })}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />
        <OdsButton
          className={'w-full'}
          label={t('validate', { ns: NAMESPACES.ACTIONS })}
          isDisabled={!isValid}
          type="submit"
          data-testid="validate-button"
        />
      </form>
    </div>
  );
}
