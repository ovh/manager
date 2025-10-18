import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
  ODS_TEXT_PRESET,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  OdsPhoneNumberCountryIsoCode,
} from '@ovhcloud/ods-components';
import {
  OdsModal,
  OdsText,
  OdsSelect,
  OdsInput,
  OdsPhoneNumber,
  OdsFormField,
  OdsButton,
} from '@ovhcloud/ods-components/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useGetMeModels } from '@/data/hooks/organisation/useGetMeModels';
import { useGetSingleOrganisationDetail } from '@/data/hooks/organisation';
import {
  postorputOrganisations,
  getOrganisationListQueryKey,
  getOrganisationsDetailsQueryKey,
  OrgDetails,
} from '@/data/api';
import Loading from '../components/Loading/Loading';
import { CountrySelector } from '@/components/CountrySelector/country-selector.component';
import '../../../../index.scss';

export default function OrganisationsModal() {
  const queryClient = useQueryClient();
  const [registry, setRegistry] = useState([]);
  const [countrylist, setCountrylist] = useState([]);
  const { t } = useTranslation([
    'manage-organisations',
    NAMESPACES?.ACTIONS,
    'region-selector',
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const { organisationId } = useParams();
  const isEditMode =
    !!new URLSearchParams(location.search).get('mode') || false;
  const { addError, addSuccess, clearNotifications } = useNotifications();
  let defaultValues = {};
  if (isEditMode) {
    const { orgDetail } = useGetSingleOrganisationDetail({
      organisationId,
    });
    defaultValues = { ...orgDetail };
  }

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isSubmitted, errors },
    watch,
    setError,
    clearErrors,
  } = useForm<OrgDetails>({
    defaultValues,
  });

  const selectedCountry = watch('country');

  const { models, isLoading } = useGetMeModels();

  useEffect(() => {
    if (!models) return;
    setRegistry(models['nichandle.IpRegistryEnum'].enum);
    setCountrylist(models['nichandle.CountryEnum'].enum);
  }, [isLoading]);

  const cancel = () => {
    navigate('..');
  };

  const { mutate: postManageOrganisation, isPending: isSending } = useMutation({
    mutationFn: (params: OrgDetails) =>
      postorputOrganisations(params, isEditMode),
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('manageOrganisationsSuccessMessage'), true);
      queryClient.invalidateQueries({
        queryKey: getOrganisationListQueryKey(),
      });
      if (isEditMode) {
        queryClient.invalidateQueries({
          queryKey: getOrganisationsDetailsQueryKey({
            organisationId,
          }),
        });
      }
      navigate('..');
    },
    onError: (error: ApiError) => {
      clearNotifications();
      addError(
        t('manageOrganisationsErrorMessage', {
          error: error?.response?.data?.message,
        }),
        true,
      );
      navigate('..');
    },
  });

  const onSubmit = (data: OrgDetails) => {
    postManageOrganisation(data);
  };

  return (
    <OdsModal
      class="ods-manage-org-modal"
      isOpen
      isDismissible
      onOdsClose={cancel}
    >
      <OdsText preset={ODS_TEXT_PRESET.heading3} data-testid="modal-title">
        {isEditMode
          ? t('manageOrganisationsEditOrgTitle')
          : t('manageOrganisationsAddOrgTitle')}
      </OdsText>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        {/* ip organisation selection */}
        <div className="mt-8">
          <Controller
            control={control}
            name="registry"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="w-full">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelTypeLabel')}
                </label>
                <div className="flex">
                  <OdsSelect
                    key={registry.join('-')}
                    placeholder={t('select', { ns: NAMESPACES.ACTIONS })}
                    className="mt-1 flex-1"
                    id={name}
                    name={name}
                    value={value}
                    hasError={!!errors[name]}
                    isDisabled={isLoading || isEditMode}
                    isRequired
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  >
                    {registry?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    )) || []}
                  </OdsSelect>
                  {isLoading && (
                    <Loading
                      className="flex justify-center"
                      size={ODS_SPINNER_SIZE.sm}
                    />
                  )}
                </div>
              </OdsFormField>
            )}
          />
        </div>

        {/* firstName and surName */}
        <div className="flex gap-2 mt-1">
          <Controller
            control={control}
            name="firstname"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="w-full">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelFirstnameLabel')}
                </label>
                <OdsInput
                  name={name}
                  value={value}
                  type={ODS_INPUT_TYPE.text}
                  isRequired
                  onOdsChange={(e) => onChange(e.detail.value)}
                  hasError={!!errors[name]}
                />
              </OdsFormField>
            )}
          />
          <Controller
            control={control}
            name="lastname"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="w-full">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelSurnameLabel')}
                </label>
                <OdsInput
                  name={name}
                  value={value}
                  type={ODS_INPUT_TYPE.text}
                  isRequired
                  onOdsChange={(e) => onChange(e.detail.value)}
                  hasError={!!errors[name]}
                ></OdsInput>
              </OdsFormField>
            )}
          />
        </div>

        {/*  Country selection */}
        <div>
          <Controller
            control={control}
            name="country"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="w-full mt-1">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelCountryLabel')}
                </label>
                <CountrySelector
                  countryCodeList={countrylist?.sort((a, b) =>
                    t(`region-selector-country-name_${a}`, {
                      ns: 'region-selector',
                    }).localeCompare(
                      t(`region-selector-country-name_${b}`, {
                        ns: 'region-selector',
                      }),
                    ),
                  )}
                  name={name}
                  key={registry.join('-')}
                  value={value}
                  onChange={onChange}
                  isReadyOnly={isSending}
                  isLoading={isLoading}
                />
              </OdsFormField>
            )}
          />
        </div>

        {/* Email address */}
        <div>
          <Controller
            control={control}
            name="abuse_mailbox"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="w-full mb-1">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelEmailLabel')}
                </label>
                <OdsInput
                  className="mt-1"
                  name={name}
                  value={value}
                  type={ODS_INPUT_TYPE.text}
                  onOdsChange={(e) => onChange(e.detail.value)}
                  isRequired={true}
                  hasError={!!errors[name]}
                ></OdsInput>
              </OdsFormField>
            )}
          />
        </div>

        {/* Address */}
        <div>
          <Controller
            control={control}
            name="address"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="w-full mb-1">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelAddressLabel')}
                </label>
                <OdsInput
                  className="mt-1"
                  name={name}
                  value={value}
                  type={ODS_INPUT_TYPE.text}
                  isRequired
                  onOdsChange={(e) => onChange(e.detail.value)}
                  hasError={!!errors[name]}
                ></OdsInput>
              </OdsFormField>
            )}
          />
        </div>

        {/* city and postcode */}
        <div className="flex gap-2 mt-1">
          <Controller
            control={control}
            name="city"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="w-full">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelCityLabel')}
                </label>
                <OdsInput
                  name={name}
                  value={value}
                  type={ODS_INPUT_TYPE.text}
                  isRequired
                  onOdsChange={(e) => onChange(e.detail.value)}
                  hasError={!!errors[name]}
                />
              </OdsFormField>
            )}
          />
          <Controller
            control={control}
            name="zip"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="w-full">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelPostcodeLabel')}
                </label>
                <OdsInput
                  name={name}
                  value={value}
                  type={ODS_INPUT_TYPE.text}
                  isRequired
                  onOdsChange={(e) => onChange(e.detail.value)}
                  hasError={!!errors[name]}
                />
              </OdsFormField>
            )}
          />
        </div>

        {/* Phone */}
        <div>
          <Controller
            control={control}
            name="phone"
            render={({
              field: { onChange, value, name },
              fieldState: { error },
            }) => (
              <OdsFormField className="w-full my-1" error={error?.message}>
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelPhoneLabel')}
                </label>
                <OdsPhoneNumber
                  className="block w-full"
                  name={name}
                  value={value}
                  isRequired
                  isClearable
                  isoCode={
                    selectedCountry?.toLowerCase() as OdsPhoneNumberCountryIsoCode
                  }
                  onOdsChange={(e) => {
                    onChange(e.detail.value);
                    if (e.detail.value && e.detail.validity?.valid) {
                      clearErrors(name);
                    } else if (selectedCountry) {
                      setError(name, {
                        type: 'manual',
                        message: t('manageOrganisationsOrgModelPhoneInvalid', {
                          countryCode: t(
                            `region-selector-country-name_${selectedCountry}`,
                            { ns: 'region-selector' },
                          ),
                        }),
                      });
                    }
                  }}
                  hasError={!!error}
                />
              </OdsFormField>
            )}
          />
        </div>
        <div className="flex flex-row-reverse mt-1">
          <OdsButton
            className="m-1"
            type="submit"
            slot="actions"
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.default}
            isDisabled={isLoading || !isValid}
            isLoading={isSending}
            label={t('confirm', { ns: NAMESPACES.ACTIONS })}
          />
          <OdsButton
            className="m-1"
            slot="actions"
            onClick={cancel}
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('cancel', { ns: NAMESPACES.ACTIONS })}
          />
        </div>
      </form>
    </OdsModal>
  );
}
