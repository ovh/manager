import { useEffect, useState } from 'react';

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  OdsPhoneNumberCountryIsoCode,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsModal,
  OdsPhoneNumber,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { CountrySelector } from '@/components/CountrySelector/country-selector.component';
import {
  OrgDetails,
  getOrganisationListQueryKey,
  getOrganisationsDetailsQueryKey,
  postorputOrganisations,
} from '@/data/api';
import { useGetSingleOrganisationDetail } from '@/data/hooks/organisation';
import { useGetMeModels } from '@/data/hooks/organisation/useGetMeModels';
import { TRANSLATION_NAMESPACES } from '@/utils';

import '../../../../index.scss';
import Loading from '../components/Loading/Loading';

export default function OrganisationsModal() {
  const queryClient = useQueryClient();
  const [registry, setRegistry] = useState<string[]>([]);
  const [countrylist, setCountrylist] = useState<string[]>([]);
  const { t } = useTranslation([
    'manage-organisations',
    NAMESPACES?.ACTIONS,
    'region-selector',
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const { organisationId } = useParams();
  const [search] = useSearchParams();
  const isEditMode =
    !!new URLSearchParams(location.search).get('mode') || false;
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { orgDetail } = useGetSingleOrganisationDetail({
    organisationId: organisationId,
    enabled: isEditMode,
  });
  const { trackClick, trackPage } = useOvhTracking();

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    watch,
    setError,
    clearErrors,
  } = useForm<OrgDetails>({
    defaultValues: { ...orgDetail },
  });

  const selectedCountry = watch('country');

  const { models, isLoading } = useGetMeModels();

  useEffect(() => {
    if (!models) return;
    setRegistry(models?.['nichandle.IpRegistryEnum'].enum);
    setCountrylist(models?.['nichandle.CountryEnum'].enum);
  }, [isLoading]);

  const cancel = () => {
    trackClick({
      actionType: 'action',
      buttonType: ButtonType.button,
      location: PageLocation.popup,
      actions: [`${isEditMode ? 'edit' : 'add'}_organization`, 'cancel'],
    });
    navigate(`..?${search.toString()}`);
  };

  const { mutate: postManageOrganisation, isPending: isSending } = useMutation({
    mutationFn: (params: OrgDetails) =>
      postorputOrganisations(params, isEditMode),
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('manageOrganisationsSuccessMessage'), true);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: `${isEditMode ? 'edit' : 'add'}_organization_success`,
      });
      queryClient.invalidateQueries({
        queryKey: getOrganisationListQueryKey(),
      });
      if (isEditMode) {
        queryClient.invalidateQueries({
          queryKey: getOrganisationsDetailsQueryKey({
            organisationId: organisationId,
          }),
        });
      }
      navigate(`..?${search.toString()}`);
    },
    onError: (error: ApiError) => {
      clearNotifications();
      addError(
        t('manageOrganisationsErrorMessage', {
          error: error?.response?.data?.message,
        }),
        true,
      );
      trackPage({
        pageType: PageType.bannerError,
        pageName: `${isEditMode ? 'edit' : 'add'}_organization_error`,
      });
      navigate(`..?${search.toString()}`);
    },
  });

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
      <form
        className="flex flex-col gap-2"
        onSubmit={e => {
          handleSubmit((data) => {
          trackClick({
            actionType: 'action',
            buttonType: ButtonType.button,
            location: PageLocation.popup,
            actions: [`${isEditMode ? 'edit' : 'add'}_organization`, 'confirm'],
          });
          postManageOrganisation(data);
        })(e);
        }}
      >
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
        <div className="mt-1 flex gap-2">
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
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="mt-1 w-full">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelCountryLabel')}
                </label>
                <CountrySelector
                  countryCodeList={countrylist?.sort((a, b) =>
                    t(`region-selector-country-name_${a}`, {
                      ns: TRANSLATION_NAMESPACES.regionSelector,
                    }).localeCompare(
                      t(`region-selector-country-name_${b}`, {
                        ns: TRANSLATION_NAMESPACES.regionSelector,
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
              <OdsFormField className="mb-1 w-full">
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
              <OdsFormField className="mb-1 w-full">
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
        <div className="mt-1 flex gap-2">
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
              <OdsFormField className="my-1 w-full" error={error?.message}>
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
                            {
                              ns: TRANSLATION_NAMESPACES.regionSelector,
                            },
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
        <div className="mt-1 flex flex-row-reverse">
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
