import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  ODS_TEXT_PRESET,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
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
import { useMutation } from '@tanstack/react-query';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useGetMeModels } from '@/data/hooks/organisation/useGetMeModels';
import { useGetSingleOrganisationDetail } from '@/data/hooks/organisation';
import { postOrganisations, OrgDetails } from '@/data/api';
import Loading from '../components/Loading/Loading';
import '../../../../index.scss';

export const OpenOrganisationsModal: React.FC<{ isOpen: boolean }> = ({
  isOpen = true,
}) => {
  const [registry, setRegistry] = useState([]);
  const [countrylist, setCountrylist] = useState([]);
  const { t } = useTranslation('manage-organisations');
  const { t: tcommon } = useTranslation(NAMESPACES?.ACTIONS);
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
  } = useForm({
    defaultValues,
  });

  const { models, isLoading } = useGetMeModels();

  useEffect(() => {
    if (!models) return;
    setRegistry(models['nichandle.IpRegistryEnum'].enum);
    setCountrylist(models['nichandle.CountryEnum'].enum);
  }, [isLoading]);

  const closeModal = () => {
    navigate('..');
  };

  const handleCancelClick = () => {
    closeModal();
  };

  const { mutate: postManageOrganisation, isPending: isSending } = useMutation({
    mutationFn: (params: OrgDetails) => {
      return postOrganisations(params, isEditMode);
    },
    onSuccess: () => {
      clearNotifications();
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('manageOrganisationsSuccessMessage')}
        </OdsText>,
        true,
      );
      navigate('..');
    },
    onError: (error: ApiError) => {
      clearNotifications();
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('manageOrganisationsErrorMessage', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
      navigate('..');
    },
  });

  const onSubmit = (data: OrgDetails) => {
    postManageOrganisation({
      ...data,
    } as OrgDetails);
  };

  return (
    <OdsModal
      class="ods-manage-org-modal"
      isOpen={isOpen}
      isDismissible
      onOdsClose={closeModal}
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
                    placeholder={tcommon('select')}
                    className="mt-1 flex-1"
                    id={name}
                    name={name}
                    value={value}
                    hasError={!!errors[name]}
                    isDisabled={isLoading}
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
        <div className="flex justify-between">
          <Controller
            control={control}
            name="firstname"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField>
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelFirstnameLabel')}
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
          <Controller
            control={control}
            name="lastname"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField>
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelSurnameLabel')}
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

        {/*  Country selection */}
        <div>
          <Controller
            control={control}
            name="country"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="w-full">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelCountryLabel')}
                </label>
                <div className="flex">
                  <OdsSelect
                    key={registry.join('-')}
                    placeholder={tcommon('select')}
                    className="mt-1 flex-1"
                    id={name}
                    name={name}
                    value={value}
                    hasError={!!errors[name]}
                    isDisabled={isLoading}
                    isRequired
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  >
                    {countrylist?.map((item) => (
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
        <div className="flex justify-between">
          <Controller
            control={control}
            name="city"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField>
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelCityLabel')}
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
          <Controller
            control={control}
            name="zip"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField>
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelPostcodeLabel')}
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

        {/* Phone */}
        <div>
          <Controller
            control={control}
            name="phone"
            render={({ field: { name, value, onChange } }) => (
              <OdsFormField className="mb-1">
                <label htmlFor={name} slot="label">
                  {t('manageOrganisationsOrgModelPhoneLabel')}
                </label>
                <OdsPhoneNumber
                  className="w-full mt-1"
                  countries="all"
                  name={name}
                  value={value}
                  isRequired
                  onOdsChange={(e) => onChange(e.detail.value)}
                  hasError={!!errors[name]}
                ></OdsPhoneNumber>
              </OdsFormField>
            )}
          />
        </div>
        <div className="flex flex-row-reverse">
          <OdsButton
            className="m-1"
            type="submit"
            slot="actions"
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.default}
            isDisabled={isLoading || !isValid}
            isLoading={isSending}
            label={tcommon('confirm')}
            data-testid="confirm-btn"
          ></OdsButton>
          <OdsButton
            className="m-1"
            slot="actions"
            onClick={handleCancelClick}
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.outline}
            label={tcommon('cancel')}
            data-testid="cancel-btn"
          ></OdsButton>
        </div>
      </form>
    </OdsModal>
  );
};

export default OpenOrganisationsModal;
