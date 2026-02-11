import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  OdsPopover,
} from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Currency } from '@ovh-ux/manager-config';
import {
  ButtonType,
  PageLocation,
  usePageTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  Icon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTrackingContext } from '@/context/tracking/useTracking';
import {
  useCountrySettings,
  useCurrencySettings,
  useLanguageSettings,
  useSubsidiarySettings,
} from '@/data/hooks/settings/useSettings';
import {
  useRedirectToLoginUrl,
  useRedirectToSignUpUrl,
} from '@/hooks/redirection/useSettingsRedirecions';
import { useSettingsSchema } from '@/hooks/settings/useSettings';
import { useTrackError } from '@/hooks/tracking/useTracking';
import { DEFAULT_REDIRECT_URL } from './settings.constants';
import { getWebsiteLabel } from './settings.utils';
import AccountSettingsPopoverContent from './popover-content/PopoverContent';

type SettingsFormData = {
  country: string;
  currency: string;
  language: string;
};

export default function Settings() {
  const { t } = useTranslation([
    'settings',
    NAMESPACES.ACTIONS,
    NAMESPACES.ONBOARDING,
    NAMESPACES.FORM,
  ]);
  const { trackClick } = useTrackingContext();
  const { trackError } = useTrackError('choose-preferences');
  const pageTracking = usePageTracking();
  const redirectToLoginUrl = useRedirectToLoginUrl();
  const redirectToSignUpUrl = useRedirectToSignUpUrl();

  const schema = useSettingsSchema();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<SettingsFormData>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
  });

  const selectedCountry = watch('country');
  const selectedCurrency = watch('currency');
  const selectedLanguage = watch('language');
  const isFormComplete = Boolean(
    selectedCountry && selectedCurrency && selectedLanguage,
  );
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

  const listSettingsDescription = [
    t('setting_description_list_first'),
    t('setting_description_list_second'),
    t('setting_description_list_last'),
  ];

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
      setValue('currency', currencies[0].code, { shouldValidate: true });
    }
  }, [currencies, selectedCountry, setValue]);

  useEffect(() => {
    if (languages?.length === 1) {
      setValue('language', languages[0].ietfLanguageTag, {
        shouldValidate: true,
      });
    }
  }, [languages, selectedCountry, selectedCurrency, setValue]);

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
    ({ country, language }: SettingsFormData) => {
      if (pageTracking) {
        trackClick(pageTracking, {
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actions: [
            'account-creation-choose-preferences',
            'next',
            `${ovhSubsidiary}_${language}`,
          ],
        });
      }
      // In case the signup url is not valid, we will redirect to the website
      if (redirectToSignUpUrl !== null) {
        const params = `ovhSubsidiary=${ovhSubsidiary}&country=${country}&language=${language}`;
        const junction = redirectToSignUpUrl.includes('?') ? '&' : '?';
        window.location.href = `${redirectToSignUpUrl}${junction}${params}`;
      } else {
        window.location.href = DEFAULT_REDIRECT_URL;
      }
    },
    [redirectToSignUpUrl, ovhSubsidiary],
  );

  const trackAuthLinkClick = useCallback(() => {
    if (pageTracking) {
      trackClick(pageTracking, {
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actions: ['login'],
      });
    }
  }, [trackClick, pageTracking]);

  return (
    <div className={'flex flex-col gap-8'}>
      <div className={'flex flex-col gap-5'}>
        <OdsText preset={ODS_TEXT_PRESET.heading1}>{t('title')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <span className="mr-2">{t('description')}</span>
          <OdsLink
            href={redirectToLoginUrl || DEFAULT_REDIRECT_URL}
            onClick={() => trackAuthLinkClick()}
            label={t('connect')}
          />
        </OdsText>
      </div>
      <form onSubmit={handleSubmit(submitSettings)} autoComplete="off">
        <Controller
          control={control}
          name="country"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="flex flex-wrap w-full gap-3 mb-7">
              <label className="block cursor-pointer" slot={'label'}>
                {t('country_setting')} *{' '}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon
                      name="circle-question"
                      id="country-setting-description"
                    />
                  </TooltipTrigger>
                  <TooltipContent withArrow>
                    {t('find_out_more', { ns: NAMESPACES.ONBOARDING })}
                  </TooltipContent>
                </Tooltip>
              </label>
              <OdsPopover
                className="md:w-1/2 p-5"
                triggerId="country-setting-description"
                position="top-start"
                withArrow
              >
                <AccountSettingsPopoverContent
                  description={t('setting_description')}
                  list={listSettingsDescription}
                />
              </OdsPopover>
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
              {errors.country?.message && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {t(errors.country.message, { ns: NAMESPACES.FORM })}
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
              {!!currencies?.length && errors.currency?.message && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {t(errors.currency.message, { ns: NAMESPACES.FORM })}
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
              <label className="block cursor-pointer" slot={'label'}>
                {t('site_setting')} *{' '}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon
                      name="circle-question"
                      id="site-setting-description"
                    />
                  </TooltipTrigger>
                  <TooltipContent withArrow>
                    {t('find_out_more', { ns: NAMESPACES.ONBOARDING })}
                  </TooltipContent>
                </Tooltip>
              </label>
              <OdsPopover
                className="md:w-1/2 p-5"
                triggerId="site-setting-description"
                position="top-start"
                withArrow
              >
                <AccountSettingsPopoverContent
                  description={t('setting_description')}
                />
              </OdsPopover>
              <OdsSelect
                name={`site`}
                className="w-full"
                value={value}
                isDisabled={!languages?.length}
                onOdsChange={onChange}
                onBlur={onBlur}
                key={`languages_for_${selectedCountry}_${selectedCurrency}`}
                hasError={Boolean(languages?.length && errors[name])}
                data-testid="language-select"
              >
                {(languages || []).map((language) => (
                  <option
                    key={`site_${language.ietfLanguageTag}`}
                    value={language.ietfLanguageTag}
                  >
                    {getWebsiteLabel(language)}
                  </option>
                ))}
              </OdsSelect>
              {!!languages?.length && errors.language?.message && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {t(errors.language.message, { ns: NAMESPACES.FORM })}
                </OdsText>
              )}
            </OdsFormField>
          )}
        />
        <OdsButton
          className={'w-full'}
          label={t('validate', { ns: NAMESPACES.ACTIONS })}
          isDisabled={!isValid || !isFormComplete}
          type="submit"
          data-testid="validate-button"
        />
      </form>
    </div>
  );
}
