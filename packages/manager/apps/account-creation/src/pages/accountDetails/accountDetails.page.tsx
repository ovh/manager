import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsFormField,
  OdsInput,
  OdsLink,
  OdsPhoneNumber,
  OdsRadio,
  OdsSelect,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_ICON_ALIGNMENT,
  ODS_PHONE_NUMBER_COUNTRY_ISO_CODE,
  ODS_TEXT_PRESET,
  OdsPhoneNumberChangeEventDetail,
  OdsPhoneNumberCustomEvent,
} from '@ovhcloud/ods-components';
import { User } from '@ovh-ux/manager-config';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useRules } from '@/data/hooks/useRules';
import { RulesParam } from '@/data/api/rules';
import { useUserContext } from '@/context/user/useUser';
import { useMe } from '@/data/hooks/useMe';
import { Rule, RuleField } from '@/types/rule';
import {
  getZodSchemaFromRule,
  useZodTranslatedError,
} from '@/hooks/zod/useZod';
import { putMe } from '@/data/api/me';
import { putSmsConsent } from '@/data/api/marketing';
import { urls } from '@/routes/routes.constant';
import {
  getSirenFromSiret,
  isIndividualLegalForm,
  shouldAccessOrganizationSearch,
  shouldEnableSIRENDisplay,
} from '@/helpers/flowHelper';
import { useDetailsRedirection } from '@/hooks/redirection/useDetailsRedirection';

type AccountDetailsFormProps = {
  rules: Record<RuleField, Rule>;
  isLoading: boolean;
  currentUser: Partial<User>;
  updateRulesParams: (key: keyof RulesParam, value: string) => void;
};

function AccountDetailsForm({
  rules,
  isLoading,
  currentUser,
  updateRulesParams,
}: AccountDetailsFormProps) {
  const { t } = useTranslation([
    'account-details',
    'area',
    NAMESPACES.FORM,
    NAMESPACES.LANGUAGE,
    NAMESPACES.COUNTRY,
  ]);
  const { addError, addSuccess } = useNotifications();

  const { url: redirectionUrl, isLoading: isRedirectionUrlLoading } = useDetailsRedirection();

  const {
    legalForm,
    organisation,
    companyNationalIdentificationNumber,
    address,
    city,
    isSMSConsentAvailable,
  } = useUserContext();

  type FormData = Partial<User> & {
    confirmSend?: boolean;
    phoneType?: string;
    smsConsent?: boolean;
  };

  const zodSchema = useMemo(() => {
    return getZodSchemaFromRule(rules).extend({
      confirmSend: z.literal(true),
      smsConsent: z.boolean().optional(),
    });
  }, [rules]);

  function renderTranslatedZodError(message: string | undefined, rule: Rule) {
    if (!message) return undefined;
    const { key, options } = useZodTranslatedError(message, rule);
    return t(key, { ...options, ...{ ns: NAMESPACES.FORM } });
  }

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: currentUser.country || 'GB',
      language: currentUser.language || 'en_GB',
      phoneType: 'mobile',
      phoneCountry: currentUser.phoneCountry || 'GB',
      organisation,
      companyNationalIdentificationNumber,
      address: address || currentUser.address,
      city: city || currentUser.city,
      legalform: legalForm,
      smsConsent: false,
    },
    mode: 'onTouched',
    resolver: zodResolver(zodSchema),
  });

  const shouldDisplaySIREN = useMemo(
    () => shouldEnableSIRENDisplay(currentUser.country, legalForm),
    [currentUser.country, legalForm],
  );

  const corporationIdValue = useWatch({
    control,
    name: 'companyNationalIdentificationNumber',
  });

  const sirenValue = useMemo(
    () =>
      getSirenFromSiret(
        corporationIdValue,
        rules?.companyNationalIdentificationNumber?.regularExpression,
      ),
    [
      corporationIdValue,
      rules?.companyNationalIdentificationNumber?.regularExpression,
    ],
  );

  const areaLabel = useMemo(() => {
    if (
      currentUser?.country &&
      ['AU', 'US', 'IN'].includes(currentUser.country)
    )
      return 'state';
    return currentUser?.country === 'CA' ? 'province' : 'area';
  }, [currentUser.country]);

  const phoneCountry = watch('phoneCountry');
  const phoneType = watch('phoneType');

  useEffect(() => {
    if (phoneType === 'landline' && isSMSConsentAvailable) {
      setValue('smsConsent', false);
    }
  }, [phoneType, isSMSConsentAvailable, setValue]);

  useEffect(() => {
    if (phoneCountry) {
      updateRulesParams('phoneCountry', phoneCountry);
    }
  }, [phoneCountry]);

  const { mutate: addAccountDetails, isPending: isFormPending } = useMutation({
    mutationFn: async (payload: FormData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmSend, smsConsent, ...updatedUser } = payload;
      await putMe(updatedUser);

      if (isSMSConsentAvailable && payload.phoneType === 'mobile') {
        await putSmsConsent(smsConsent);
      }
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('account_details_success_message')}
        </OdsText>,
        true,
      );
      window.location.assign(redirectionUrl!);
    },
    onError: () => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('account_details_error_message')}
        </OdsText>,
        true,
      );
    },
  });

  const handleValidateClick: SubmitHandler<z.infer<typeof zodSchema>> = (
    formData,
  ) => {
    addAccountDetails(formData as FormData);
  };

  /**
   * TODO: For FR, check / add from context if user has found company. If so, make company info readonly
   */
  return (
    <>
      <Notifications />
      <form
        onSubmit={handleSubmit(handleValidateClick)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading4}>
            {t('account_details_section_personal')}
          </OdsText>
          <Controller
            control={control}
            name="firstname"
            render={({ field: { name, value, onChange, onBlur } }) => {
              const labelFirstName = !isIndividualLegalForm(legalForm)
                ? t('account_details_field_corporation_firstname')
                : t('account_details_field_firstname');
              return (
                <OdsFormField>
                  <label
                    htmlFor={name}
                    slot="label"
                    aria-label={labelFirstName}
                  >
                    <OdsText preset="caption">
                      {labelFirstName}
                      {rules?.firstname?.mandatory && ' *'}
                    </OdsText>
                  </label>
                  <OdsInput
                    isReadonly={!rules}
                    name={name}
                    value={value}
                    maxlength={rules?.firstname.maxLength || undefined}
                    hasError={!!errors[name]}
                    onOdsChange={onChange}
                    onBlur={onBlur}
                  />
                  {errors[name] && rules?.firstname && (
                    <OdsText
                      className="text-critical leading-[0.8]"
                      preset="caption"
                    >
                      {renderTranslatedZodError(
                        errors[name].message,
                        rules?.firstname,
                      )}
                    </OdsText>
                  )}
                </OdsFormField>
              );
            }}
          />
          <Controller
            control={control}
            name="name"
            render={({ field: { name, value, onChange, onBlur } }) => {
              const labelName = !isIndividualLegalForm(legalForm)
                ? t('account_details_field_corporation_lastname')
                : t('account_details_field_name');
              return (
                <OdsFormField>
                  <label htmlFor={name} slot="label" aria-label={labelName}>
                    <OdsText preset="caption">
                      {labelName}
                      {rules?.name?.mandatory && ' *'}
                    </OdsText>
                  </label>
                  <OdsInput
                    isReadonly={!rules}
                    name={name}
                    value={value}
                    maxlength={rules?.name.maxLength || undefined}
                    hasError={!!errors[name]}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  />
                  {errors[name] && rules?.name && (
                    <OdsText
                      className="text-critical leading-[0.8]"
                      preset="caption"
                    >
                      {renderTranslatedZodError(
                        errors[name].message,
                        rules?.name,
                      )}
                    </OdsText>
                  )}
                </OdsFormField>
              );
            }}
          />
        </div>

        {(rules?.organisation ||
          rules?.vat ||
          rules?.companyNationalIdentificationNumber) && (
          <div className="flex flex-col">
            <OdsText className="block" preset={ODS_TEXT_PRESET.heading4}>
              {t('account_details_section_legal')}
            </OdsText>
            <Controller
              control={control}
              name="organisation"
              render={({ field: { name, value, onChange, onBlur } }) => (
                <OdsFormField>
                  <label
                    htmlFor={name}
                    slot="label"
                    aria-label={t('account_details_field_corporation_name')}
                  >
                    <OdsText preset="caption">
                      {t('account_details_field_corporation_name')}
                      {rules?.organisation?.mandatory && ' *'}
                    </OdsText>
                  </label>
                  <OdsInput
                    isReadonly={Boolean(organisation)}
                    name="organisation"
                    value={value}
                    maxlength={rules?.organisation.maxLength || undefined}
                    hasError={!!errors[name]}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  />
                  {errors[name] && rules?.organisation && (
                    <OdsText
                      className="text-critical leading-[0.8]"
                      preset="caption"
                    >
                      {renderTranslatedZodError(
                        errors[name].message,
                        rules?.organisation,
                      )}
                    </OdsText>
                  )}
                </OdsFormField>
              )}
            />
            {rules?.companyNationalIdentificationNumber && (
              <Controller
                control={control}
                name="companyNationalIdentificationNumber"
                render={({ field: { name, value, onChange, onBlur } }) => (
                  <>
                    <OdsFormField>
                      <label
                        htmlFor={name}
                        slot="label"
                        aria-label={t('account_details_field_siret')}
                      >
                        <OdsText preset="caption">
                          {t('account_details_field_siret')}
                          {rules?.companyNationalIdentificationNumber
                            ?.mandatory && ' *'}
                        </OdsText>
                      </label>
                      <OdsInput
                        isReadonly={Boolean(
                          companyNationalIdentificationNumber,
                        )}
                        name="companyNationalIdentificationNumber"
                        value={value}
                        maxlength={
                          rules?.companyNationalIdentificationNumber
                            .maxLength || undefined
                        }
                        hasError={!!errors[name]}
                        onOdsChange={onChange}
                        onOdsBlur={onBlur}
                      />
                      {errors[name] &&
                        rules?.companyNationalIdentificationNumber && (
                          <OdsText
                            className="text-critical leading-[0.8]"
                            preset="caption"
                          >
                            {renderTranslatedZodError(
                              errors[name].message,
                              rules?.companyNationalIdentificationNumber,
                            )}
                          </OdsText>
                        )}
                    </OdsFormField>
                    {shouldDisplaySIREN && (
                      <OdsFormField>
                        <label
                          htmlFor="companyNationalRegistrationNumber"
                          slot="label"
                          aria-label={t('account_details_field_siren')}
                        >
                          <OdsText preset="caption">
                            {t('account_details_field_siren')}
                          </OdsText>
                        </label>
                        <OdsInput
                          isReadonly
                          name="companyNationalRegistrationNumber"
                          value={sirenValue}
                        />
                      </OdsFormField>
                    )}
                  </>
                )}
              />
            )}
            <Controller
              control={control}
              name="vat"
              render={({ field: { name, value, onChange, onBlur } }) => (
                <OdsFormField>
                  <label
                    htmlFor={name}
                    slot="label"
                    aria-label={t('account_details_field_vat')}
                  >
                    <OdsText preset="caption">
                      {t('account_details_field_vat')}
                      {rules?.vat?.mandatory && ' *'}
                    </OdsText>
                  </label>
                  <OdsInput
                    name="vat"
                    value={value}
                    hasError={!!errors[name]}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  />
                  {errors[name] && rules?.vat && (
                    <OdsText
                      className="text-critical leading-[0.8]"
                      preset="caption"
                    >
                      {renderTranslatedZodError(
                        errors[name].message,
                        rules?.vat,
                      )}
                    </OdsText>
                  )}
                </OdsFormField>
              )}
            />
          </div>
        )}

        <div className="flex flex-col">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading4}>
            {t(`account_details_section_address_${legalForm}`)}
          </OdsText>
          <Controller
            control={control}
            name="country"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="w-full">
                <OdsText preset="caption">
                  <label>
                    {t('account_details_field_country')}
                    {rules?.country?.mandatory && ' *'}
                  </label>
                </OdsText>
                {!isLoading ? (
                  <OdsSelect
                    isDisabled={currentUser.country !== 'UNKNOWN'}
                    name={name}
                    value={value}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                    className="flex-1"
                  >
                    {rules?.country.in?.map((countryCode: string) => (
                      <option key={countryCode} value={countryCode}>
                        {t(`country_${countryCode}`, {
                          ns: NAMESPACES.COUNTRY,
                        })}
                      </option>
                    ))}
                  </OdsSelect>
                ) : (
                  <OdsSkeleton className="w-full" />
                )}
              </OdsFormField>
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({ field: { name, value, onChange, onBlur } }) => {
              const labeladress = isIndividualLegalForm(legalForm)
                ? t('account_details_section_address_individual')
                : t('account_details_field_address');
              return (
                <OdsFormField>
                  <label htmlFor={name} slot="label" aria-label={labeladress}>
                    <OdsText preset="caption">
                      {labeladress}
                      {rules?.address?.mandatory && ' *'}
                    </OdsText>
                  </label>
                  <OdsInput
                    isReadonly={Boolean(address)}
                    name="address"
                    value={value}
                    maxlength={rules?.address.maxLength || undefined}
                    hasError={!!errors[name]}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  />
                  {errors[name] && rules?.address && (
                    <OdsText
                      className="text-critical leading-[0.8]"
                      preset="caption"
                    >
                      {renderTranslatedZodError(
                        errors[name].message,
                        rules?.address,
                      )}
                    </OdsText>
                  )}
                </OdsFormField>
              );
            }}
          />
          {rules.area && (
            <Controller
              control={control}
              name="area"
              render={({ field: { name, value, onChange, onBlur } }) => (
                <OdsFormField className="w-full">
                  <OdsText
                    preset="caption"
                    aria-label={t('account_details_field_area')}
                  >
                    <label htmlFor={name}>
                      {t(`account_details_field_${areaLabel}`)}
                      {rules?.area?.mandatory && ' *'}
                    </label>
                  </OdsText>
                  {!isLoading && (
                    <OdsSelect
                      name={name}
                      value={value}
                      onOdsChange={onChange}
                      onOdsBlur={onBlur}
                      isDisabled={!rules}
                      className="flex-1"
                      hasError={!!errors[name]}
                    >
                      {rules?.area.in?.map((area: string) => (
                        <option key={area} value={area}>
                          {t(`area_${currentUser.country}_${area}`, {
                            ns: 'area',
                          })}
                        </option>
                      ))}
                    </OdsSelect>
                  )}
                  {errors[name] && rules?.area && (
                    <OdsText
                      className="text-critical leading-[0.8]"
                      preset="caption"
                    >
                      {renderTranslatedZodError(
                        errors[name].message,
                        rules?.area,
                      )}
                    </OdsText>
                  )}
                </OdsFormField>
              )}
            />
          )}
          <Controller
            control={control}
            name="zip"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField>
                <label
                  htmlFor={name}
                  slot="label"
                  aria-label={t('account_details_field_zip')}
                >
                  <OdsText preset="caption">
                    {t('account_details_field_zip')}
                    {rules?.zip?.mandatory && ' *'}
                  </OdsText>
                </label>
                <OdsInput
                  isReadonly={!rules}
                  name="zip"
                  value={value}
                  maxlength={rules?.zip.maxLength || undefined}
                  hasError={!!errors[name]}
                  onOdsChange={onChange}
                  onOdsBlur={onBlur}
                />
                {errors[name] && rules?.zip && (
                  <OdsText
                    className="text-critical leading-[0.8]"
                    preset="caption"
                  >
                    {renderTranslatedZodError(errors[name].message, rules?.zip)}
                  </OdsText>
                )}
              </OdsFormField>
            )}
          />
          <Controller
            control={control}
            name="city"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField>
                <label
                  htmlFor={name}
                  slot="label"
                  aria-label={t('account_details_field_city')}
                >
                  <OdsText preset="caption">
                    {t('account_details_field_city')}
                    {rules?.city?.mandatory && ' *'}
                  </OdsText>
                </label>
                <OdsInput
                  isReadonly={Boolean(city)}
                  name="address"
                  value={value}
                  maxlength={rules?.city.maxLength || undefined}
                  hasError={!!errors[name]}
                  onOdsChange={onChange}
                  onOdsBlur={onBlur}
                />
                {errors[name] && rules?.city && (
                  <OdsText
                    className="text-critical leading-[0.8]"
                    preset="caption"
                  >
                    {renderTranslatedZodError(
                      errors[name].message,
                      rules?.city,
                    )}
                  </OdsText>
                )}
              </OdsFormField>
            )}
          />
        </div>

        <div className="flex flex-col">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading4}>
            {t('account_details_section_contact')}
          </OdsText>
          {rules?.phoneType ? (
            <Controller
              control={control}
              name="phoneType"
              render={({ field }) => (
                <OdsFormField class="w-full mt-8 mb-4 flex flex-row gap-4">
                  {rules?.phoneType.in?.map((type: string) => (
                    <div key={type} className="flex leading-none gap-4">
                      <OdsRadio
                        name={field.name}
                        value={type}
                        isChecked={field.value === type}
                        onOdsChange={field.onChange}
                        className="cursor-pointer"
                      ></OdsRadio>
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        {t(`account_details_phone_type_option_${type}`)}
                      </OdsText>
                    </div>
                  ))}
                </OdsFormField>
              )}
            />
          ) : (
            <div className="flex flex-row gap-4 mt-8 mb-4">
              <OdsSkeleton className="w-full" />
              <OdsSkeleton className="w-full" />
            </div>
          )}
          {
            <OdsFormField>
              <OdsText
                preset="caption"
                aria-label={t('account_details_field_phone')}
              >
                <label htmlFor="phone">
                  {t('account_details_field_phone')}
                  {rules?.phone?.mandatory && ' *'}
                </label>
              </OdsText>
              <OdsPhoneNumber
                name="phone"
                countries={
                  rules?.phoneCountry && rules?.phoneCountry.in
                    ? [
                        ...rules?.phoneCountry.in
                          .filter(
                            (countryCode: string) =>
                              ODS_PHONE_NUMBER_COUNTRY_ISO_CODE[
                                countryCode.toLowerCase() as keyof typeof ODS_PHONE_NUMBER_COUNTRY_ISO_CODE
                              ],
                          )
                          .map(
                            (countryCode: string) =>
                              countryCode.toLowerCase() as ODS_PHONE_NUMBER_COUNTRY_ISO_CODE,
                          ),
                      ]
                    : []
                }
                value={watch('phone')}
                isoCode={
                  watch(
                    'phoneCountry',
                  )?.toLowerCase() as ODS_PHONE_NUMBER_COUNTRY_ISO_CODE
                }
                onOdsChange={(
                  e: OdsPhoneNumberCustomEvent<OdsPhoneNumberChangeEventDetail>,
                ) => {
                  switch (e.detail.name) {
                    case 'iso-code':
                      setValue('phoneCountry', e.detail.value?.toUpperCase());
                      break;
                    case 'phone':
                      setValue('phone', e.detail.value || '');
                      break;
                    default:
                      break;
                  }
                }}
                class="w-full flex flex-row"
              />
              {errors.phone && rules?.phone && (
                <OdsText
                  className="text-critical leading-[0.8]"
                  preset="caption"
                >
                  {renderTranslatedZodError(errors.phone.message, rules?.phone)}
                </OdsText>
              )}
            </OdsFormField>
          }
        </div>

        <div className="flex flex-col">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading4}>
            {t('account_details_section_support')}
          </OdsText>
          <Controller
            control={control}
            name="language"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="w-full">
                <OdsText
                  preset="caption"
                  aria-label={t('account_details_field_preferred_language')}
                >
                  <label htmlFor={name}>
                    {t('account_details_field_preferred_language')}
                    {rules?.language?.mandatory && ' *'}
                  </label>
                </OdsText>
                {!isLoading && (
                  <OdsSelect
                    name={name}
                    value={value}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                    isDisabled={!rules}
                    className="flex-1"
                  >
                    {rules?.language
                      ? rules?.language.in?.map((lang: string) => (
                          <option key={lang} value={lang}>
                            {t(`language_${lang}`, {
                              ns: NAMESPACES.LANGUAGE,
                            })}
                          </option>
                        ))
                      : null}
                  </OdsSelect>
                )}
              </OdsFormField>
            )}
          />
        </div>

        {isSMSConsentAvailable && phoneType === 'mobile' && (
          <div className="flex flex-col">
            <Controller
              control={control}
              name="smsConsent"
              render={({ field: { name, value, onChange, onBlur } }) => (
                <OdsFormField>
                  <div className="w-full flex flex-row gap-4 items-center cursor-pointer ">
                    <OdsCheckbox
                      inputId={name}
                      hasError={!!errors[name]}
                      id={name}
                      name={name}
                      onBlur={onBlur}
                      isChecked={Boolean(value)}
                      value={(value as unknown) as string}
                      onClick={() => onChange(!value)}
                      class="flex-[0]"
                    ></OdsCheckbox>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      <label htmlFor={name}>
                        {t('account_details_field_sms_consent')}
                      </label>
                    </OdsText>
                  </div>
                  {errors.smsConsent && (
                    <OdsText
                      className="text-critical leading-[0.8]"
                      preset="caption"
                    >
                      {t('required_field', { ns: NAMESPACES.FORM })}
                    </OdsText>
                  )}
                </OdsFormField>
              )}
            />
          </div>
        )}

        <div className="flex flex-col">
          <Controller
            control={control}
            name="confirmSend"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField>
                <div className="w-full flex flex-row gap-4 items-center cursor-pointer ">
                  <OdsCheckbox
                    inputId={name}
                    hasError={!!errors[name]}
                    id={name}
                    name={name}
                    onBlur={onBlur}
                    isChecked={Boolean(value)}
                    value={(value as unknown) as string}
                    onClick={() => onChange(!value)}
                    class="flex-[0]"
                  ></OdsCheckbox>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    <label htmlFor={name}>
                      {t('account_details_field_confirm_send')}
                    </label>
                  </OdsText>
                </div>
                {errors.confirmSend && (
                  <OdsText
                    className="text-critical leading-[0.8]"
                    preset="caption"
                  >
                    {t('required_field', { ns: NAMESPACES.FORM })}
                  </OdsText>
                )}
              </OdsFormField>
            )}
          />
        </div>
        <OdsButton
          type="submit"
          slot="actions"
          className="w-full"
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.default}
          isLoading={isFormPending || isRedirectionUrlLoading || !redirectionUrl}
          data-testid="confirm-btn"
          label={t('account_details_button_validate')}
        ></OdsButton>
      </form>
    </>
  );
}

export default function AccountDetailsPage() {
  const { t } = useTranslation('account-details');
  const { t: tCommon } = useTranslation('common');
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const [ searchParams ] = useSearchParams();
  const { legalForm, organisation } = useUserContext();
  const { data: currentUser } = useMe();
  const wentThroughOrganizationSearch = shouldAccessOrganizationSearch(
    currentUser?.country,
    legalForm,
  );

  const header = {
    title: t(
      `account_details_title_${legalForm}${organisation ? '_prefilled' : ''}`,
    ),
  };

  const [rulesParams, setRulesParams] = useState<RulesParam>({
    country: currentUser?.country || 'GB',
    language: currentUser?.language || 'en_GB',
    legalform: legalForm || 'corporation',
    ovhSubsidiary: currentUser?.ovhSubsidiary || 'GB',
    phoneCountry: currentUser?.country || 'GB',
  });

  const { data: rules, refetch: refetchRules, isLoading } = useRules(
    rulesParams,
  );

  const updateRulesParams = useCallback(
    (key: keyof RulesParam, value: string) => {
      if (rulesParams[key] === value) {
        return;
      }
      setRulesParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  useEffect(() => {
    refetchRules();
  }, [rulesParams]);

  return (
    <>
      <OdsLink
        icon={ODS_ICON_NAME.arrowLeft}
        iconAlignment={ODS_LINK_ICON_ALIGNMENT.left}
        href={`#${
          wentThroughOrganizationSearch ? urls.company : urls.accountType
        }?${searchParams.toString()}`}
        label={tAction('back')}
        className="flex mb-6"
      />
      {wentThroughOrganizationSearch && (
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {tCommon('step', { current: 2, total: 2 })}
        </OdsText>
      )}
      <BaseLayout header={header}>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-6">
          {t('account_details_info_message')}
        </OdsText>
        {rules && (
          <AccountDetailsForm
            rules={rules}
            isLoading={isLoading}
            currentUser={{ ...(currentUser || {}), ...rulesParams }}
            updateRulesParams={updateRulesParams}
          />
        )}
      </BaseLayout>
    </>
  );
}
