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
  Button,
  FormField,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  PhoneNumber,
  Select,
  Text,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  INPUT_TYPE,
  SPINNER_SIZE,
  TEXT_PRESET,
  FormFieldLabel,
  FormFieldError,
  PhoneNumberControl,
  PhoneNumberCountryList,
  PhoneNumberCountryIsoCode,
  SelectContent,
  SelectControl,
  Spinner,
  ModalHeader,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';
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
    organisationId,
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

  const { models, loading } = useGetMeModels();

  useEffect(() => {
    if (!models) return;
    setRegistry(models?.['nichandle.IpRegistryEnum'].enum);
    setCountrylist(models?.['nichandle.CountryEnum'].enum);
  }, [loading]);

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
            organisationId,
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
    <Modal open onOpenChange={cancel}>
      <ModalContent>
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading3}>
            {isEditMode
              ? t('manageOrganisationsEditOrgTitle')
              : t('manageOrganisationsAddOrgTitle')}
          </Text>
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={(e) => {
              handleSubmit((data) => {
                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.button,
                  location: PageLocation.popup,
                  actions: [
                    `${isEditMode ? 'edit' : 'add'}_organization`,
                    'confirm',
                  ],
                });
                postManageOrganisation(data);
              })(e);
            }}
          >
            {/* ip organisation selection */}
            <div>
              <Controller
                control={control}
                name="registry"
                render={({ field: { name, value, onChange, onBlur } }) => (
                  <FormField className="w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelTypeLabel')}
                    </FormFieldLabel>
                    <div className="flex">
                      <Select
                        key={registry.join('-')}
                        className="mt-1 flex-1"
                        id={name}
                        name={name}
                        value={[value]}
                        invalid={!!errors[name]}
                        disabled={loading || isEditMode}
                        required
                        onValueChange={onChange}
                        onBlur={onBlur}
                        items={
                          registry?.map((item) => ({
                            label: item,
                            value: item,
                          })) || []
                        }
                      >
                        <SelectContent />
                        <SelectControl
                          placeholder={t('select', { ns: NAMESPACES.ACTIONS })}
                        />
                      </Select>
                      {loading && (
                        <div className="flex justify-center">
                          <Spinner size={SPINNER_SIZE.sm} />
                        </div>
                      )}
                    </div>
                  </FormField>
                )}
              />
            </div>

            {/* firstName and surName */}
            <div className="mt-1 flex gap-2">
              <Controller
                control={control}
                name="firstname"
                render={({ field: { name, value, onChange } }) => (
                  <FormField className="w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelFirstnameLabel')}
                    </FormFieldLabel>
                    <Input
                      name={name}
                      value={value}
                      type={INPUT_TYPE.text}
                      required
                      onChange={(e) => onChange(e.target.value)}
                      invalid={!!errors[name]}
                    />
                  </FormField>
                )}
              />
              <Controller
                control={control}
                name="lastname"
                render={({ field: { name, value, onChange } }) => (
                  <FormField className="w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelSurnameLabel')}
                    </FormFieldLabel>
                    <Input
                      name={name}
                      value={value}
                      type={INPUT_TYPE.text}
                      required
                      onChange={(e) => onChange(e.target.value)}
                      invalid={!!errors[name]}
                    />
                  </FormField>
                )}
              />
            </div>

            {/*  Country selection */}
            <div>
              <Controller
                control={control}
                name="country"
                render={({ field: { name, value, onChange } }) => (
                  <FormField className="mt-1 w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelCountryLabel')}
                    </FormFieldLabel>
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
                      onValueChange={onChange}
                      readOnly={isSending}
                      loading={loading}
                    />
                  </FormField>
                )}
              />
            </div>

            {/* Email address */}
            <div>
              <Controller
                control={control}
                name="abuse_mailbox"
                render={({ field: { name, value, onChange } }) => (
                  <FormField className="mb-1 w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelEmailLabel')}
                    </FormFieldLabel>
                    <Input
                      className="mt-1"
                      name={name}
                      value={value}
                      type={INPUT_TYPE.text}
                      onChange={(e) => onChange(e.target.value)}
                      required
                      invalid={!!errors[name]}
                    />
                  </FormField>
                )}
              />
            </div>

            {/* Address */}
            <div>
              <Controller
                control={control}
                name="address"
                render={({ field: { name, value, onChange } }) => (
                  <FormField className="mb-1 w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelAddressLabel')}
                    </FormFieldLabel>
                    <Input
                      className="mt-1"
                      name={name}
                      value={value}
                      type={INPUT_TYPE.text}
                      required
                      onChange={(e) => onChange(e.target.value)}
                      invalid={!!errors[name]}
                    />
                  </FormField>
                )}
              />
            </div>

            {/* city and postcode */}
            <div className="mt-1 flex gap-2">
              <Controller
                control={control}
                name="city"
                render={({ field: { name, value, onChange } }) => (
                  <FormField className="w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelCityLabel')}
                    </FormFieldLabel>
                    <Input
                      name={name}
                      value={value}
                      type={INPUT_TYPE.text}
                      required
                      onChange={(e) => onChange(e.target.value)}
                      invalid={!!errors[name]}
                    />
                  </FormField>
                )}
              />
              <Controller
                control={control}
                name="zip"
                render={({ field: { name, value, onChange } }) => (
                  <FormField className="w-full">
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelPostcodeLabel')}
                    </FormFieldLabel>
                    <Input
                      name={name}
                      value={value}
                      type={INPUT_TYPE.text}
                      required
                      onChange={(e) => onChange(e.target.value)}
                      invalid={!!errors[name]}
                    />
                  </FormField>
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
                  <FormField className="my-1 w-full" invalid={!!error?.message}>
                    <FormFieldLabel>
                      {t('manageOrganisationsOrgModelPhoneLabel')}
                    </FormFieldLabel>
                    <PhoneNumber
                      className="block w-full"
                      name={name}
                      value={value}
                      required
                      country={
                        selectedCountry?.toLowerCase() as PhoneNumberCountryIsoCode
                      }
                      onValueChange={(e) => {
                        onChange(e.value);
                        if (e.value && !e.parsingError && e.isNumberValid) {
                          clearErrors(name);
                        } else if (selectedCountry) {
                          setError(name, {
                            type: 'manual',
                            message: t(
                              'manageOrganisationsOrgModelPhoneInvalid',
                              {
                                countryCode: t(
                                  `region-selector-country-name_${selectedCountry}`,
                                  {
                                    ns: TRANSLATION_NAMESPACES.regionSelector,
                                  },
                                ),
                              },
                            ),
                          });
                        }
                      }}
                      invalid={!!error}
                    >
                      <PhoneNumberCountryList />
                      <PhoneNumberControl clearable />
                    </PhoneNumber>
                    <FormFieldError>{!!error?.message}</FormFieldError>
                  </FormField>
                )}
              />
            </div>
            <div className="mt-1 flex flex-row-reverse">
              <Button
                className="m-1"
                type="submit"
                color={BUTTON_COLOR.primary}
                variant={BUTTON_VARIANT.default}
                disabled={loading || !isValid}
                loading={isSending}
              >
                {t('confirm', { ns: NAMESPACES.ACTIONS })}
              </Button>
              <Button
                className="m-1"
                onClick={cancel}
                color={BUTTON_COLOR.primary}
                variant={BUTTON_VARIANT.outline}
              >
                {t('cancel', { ns: NAMESPACES.ACTIONS })}
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
