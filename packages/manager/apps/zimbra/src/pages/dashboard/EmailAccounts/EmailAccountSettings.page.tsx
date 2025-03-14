import React, { useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsPassword,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  OdsSelectChangeEvent,
} from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useGenerateUrl, usePlatform } from '@/hooks';
import {
  AccountBodyParamsType,
  AccountType,
  postZimbraPlatformAccount,
  putZimbraPlatformAccount,
} from '@/api/account';
import { DomainType } from '@/api/domain';
import {
  AddEmailAccountSchema,
  addEmailAccountSchema,
  editEmailAccountSchema,
} from '@/utils';
import queryClient from '@/queryClient';
import {
  ADD_EMAIL_ACCOUNT,
  CANCEL,
  CONFIRM,
  EDIT_EMAIL_ACCOUNT,
} from '@/tracking.constant';
import { getZimbraPlatformListQueryKey } from '@/api/platform';

export default function EmailAccountSettings({
  domains = [],
  editAccountDetail = null,
}: Readonly<{
  domains: DomainType[];
  editAccountDetail: AccountType;
}>) {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common']);
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const trackingName = editAccountDetail
    ? EDIT_EMAIL_ACCOUNT
    : ADD_EMAIL_ACCOUNT;
  const [selectedDomainOrganization, setSelectedDomainOrganization] = useState(
    '',
  );
  const goBackUrl = useGenerateUrl('..', 'path');

  const onClose = () => {
    return navigate(goBackUrl);
  };

  const { mutate: addOrEditEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (params: AccountBodyParamsType) => {
      return editEmailAccountId
        ? putZimbraPlatformAccount(platformId, editEmailAccountId, params)
        : postZimbraPlatformAccount(platformId, params);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editEmailAccountId
              ? 'zimbra_account_edit_success_message'
              : 'zimbra_account_add_success_message',
          )}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editEmailAccountId
              ? 'zimbra_account_edit_error_message'
              : 'zimbra_account_add_error_message',
            {
              error: error?.response?.data?.message,
            },
          )}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformListQueryKey(),
      });
      onClose();
    },
  });

  const handleSaveClick: SubmitHandler<AddEmailAccountSchema> = (data) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });

    const { account, domain } = data;

    const payload: Record<string, unknown> = {
      email: `${account}@${domain}`.toLowerCase(),
    };

    Object.entries(data).forEach(([key, value]) => {
      if (
        ![
          'account',
          'domain',
          editEmailAccountId && data.password === '' ? 'password' : '',
        ].includes(key)
      ) {
        payload[key] = value;
      }
    });

    addOrEditEmailAccount(payload as AccountBodyParamsType);
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CANCEL],
    });
    onClose();
  };

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      account: editAccountDetail?.currentState?.email?.split('@')[0] || '',
      domain: editAccountDetail?.currentState?.email?.split('@')[1] || '',
      firstName: editAccountDetail?.currentState?.firstName || '',
      lastName: editAccountDetail?.currentState?.lastName || '',
      displayName: editAccountDetail?.currentState?.displayName || '',
      password: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(
      editEmailAccountId ? editEmailAccountSchema : addEmailAccountSchema,
    ),
  });

  const setSelectedOrganization = (e: OdsSelectChangeEvent) => {
    const organizationLabel = domains.find(
      ({ currentState }) => currentState.name === e?.detail?.value,
    )?.currentState.organizationLabel;
    setSelectedDomainOrganization(organizationLabel);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSaveClick)}
      className="w-full md:w-3/4 space-y-4"
    >
      <OdsText preset={ODS_TEXT_PRESET.caption} className="block">
        {t('common:form_mandatory_fields')}
      </OdsText>
      <Controller
        control={control}
        name="account"
        render={({ field: { name, value, onChange, onBlur } }) => (
          <OdsFormField className="w-full" error={errors?.[name]?.message}>
            <label htmlFor={name} slot="label">
              {t('common:email_account')} *
            </label>
            <div className="flex">
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                placeholder={t('common:account_name')}
                data-testid="input-account"
                className="flex-1"
                id={name}
                name={name}
                hasError={!!errors[name]}
                value={value}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                name="@"
                value="@"
                isReadonly
                isDisabled
                className="input-at w-10"
              />
              <Controller
                control={control}
                name="domain"
                render={({ field }) => (
                  <OdsSelect
                    id={name}
                    name={field.name}
                    hasError={!!errors[field.name]}
                    value={field.value}
                    className="w-1/2"
                    placeholder={t('common:select_domain')}
                    onOdsChange={(e) => {
                      field.onChange(e);
                      setSelectedOrganization(e);
                    }}
                    onOdsBlur={field.onBlur}
                    data-testid="select-domain"
                  >
                    {domains.map(({ currentState: domain }) => (
                      <option key={domain.name} value={domain.name}>
                        {domain.name}
                      </option>
                    ))}
                  </OdsSelect>
                )}
              />
            </div>
          </OdsFormField>
        )}
      />
      <OdsText preset={ODS_TEXT_PRESET.caption} className="flex flex-col">
        <span className="block">{t('common:form_email_helper')}</span>
        {[1, 2, 3].map((elm) => (
          <span key={elm} className="block">
            - {t(`common:form_email_helper_rule_${elm}`)}
          </span>
        ))}
      </OdsText>
      {selectedDomainOrganization && (
        <OdsMessage
          className="w-full"
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.information}
        >
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_account_add_message_organization', {
              organizationLabel: selectedDomainOrganization,
            })}
          </OdsText>
        </OdsMessage>
      )}
      <div className="flex">
        <Controller
          control={control}
          name="lastName"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField
              className="w-full md:w-1/2 pr-6"
              error={errors?.[name]?.message}
            >
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_lastName_label')}
              </label>
              <OdsInput
                placeholder={t('zimbra_account_add_input_lastName_placeholder')}
                type={ODS_INPUT_TYPE.text}
                id={name}
                name={name}
                hasError={!!errors[name]}
                value={value}
                defaultValue=""
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="firstName"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField
              className="w-full md:w-1/2 pl-6"
              error={errors?.[name]?.message}
            >
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_firstName_label')}
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                placeholder={t(
                  'zimbra_account_add_input_firstName_placeholder',
                )}
                name={name}
                hasError={!!errors[name]}
                value={value}
                defaultValue=""
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
            </OdsFormField>
          )}
        />
      </div>
      <div className="flex w-full md:w-1/2">
        <Controller
          control={control}
          name="displayName"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField
              className="w-full md:pr-6"
              error={errors?.[name]?.message}
            >
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_displayName_label')}
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                placeholder={t(
                  'zimbra_account_add_input_displayName_placeholder',
                )}
                name={name}
                hasError={!!errors[name]}
                value={value}
                defaultValue=""
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              />
            </OdsFormField>
          )}
        />
      </div>
      <div className="flex w-full md:w-1/2">
        <Controller
          control={control}
          name="password"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField
              className="w-full md:pr-6"
              error={errors?.[name]?.message}
            >
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_password_label')}
                {!editAccountDetail && ' *'}
              </label>
              <OdsPassword
                data-testid="input-password"
                isMasked
                className="w-full"
                id={name}
                name={name}
                hasError={!!errors[name]}
                value={value}
                onOdsBlur={onBlur}
                onOdsChange={(e) => {
                  // this is necessary because OdsPassword returns
                  // value as null somehow
                  onChange(e?.detail?.value || '');
                }}
              />
            </OdsFormField>
          )}
        />
      </div>
      <OdsText preset={ODS_TEXT_PRESET.caption} className="flex flex-col">
        <span className="block">
          {t('zimbra_account_add_input_password_helper')}
        </span>
        {[1, 2, 3].map((elm) => (
          <span key={elm} className="block">
            - {t(`zimbra_account_add_input_password_helper_rule_${elm}`)}
          </span>
        ))}
      </OdsText>

      <div className="flex space-x-5">
        <OdsButton
          slot="actions"
          type="submit"
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!isDirty || !isValid}
          isLoading={isSending}
          data-testid="confirm-btn"
          label={!editAccountDetail ? t('common:confirm') : t('common:save')}
        />
        {editAccountDetail && (
          <OdsButton
            slot="actions"
            onClick={handleCancelClick}
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('common:cancel')}
          />
        )}
      </div>
    </form>
  );
}
