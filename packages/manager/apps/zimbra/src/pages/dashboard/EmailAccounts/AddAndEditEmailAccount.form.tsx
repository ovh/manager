import React, { useEffect, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_SPINNER_SIZE,
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
import { useAccount, useDomains, useGenerateUrl } from '@/hooks';
import {
  AccountBodyParamsType,
  postZimbraPlatformAccount,
  putZimbraPlatformAccount,
} from '@/api/account';
import {
  AddEmailAccountSchema,
  addEmailAccountSchema,
  editEmailAccountSchema,
} from '@/utils';
import queryClient from '@/queryClient';
import {
  ADD_EMAIL_ACCOUNT,
  CONFIRM,
  EDIT_EMAIL_ACCOUNT,
} from '@/tracking.constant';
import { getZimbraPlatformListQueryKey } from '@/api/platform';
import { ResourceStatus } from '@/api/api.type';
import Loading from '@/components/Loading/Loading';

export default function AddAndEditEmailAccountForm() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common']);
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { platformId, accountId } = useParams();
  const trackingName = accountId ? EDIT_EMAIL_ACCOUNT : ADD_EMAIL_ACCOUNT;

  const { data: emailAccount } = useAccount({
    accountId,
    enabled: !!accountId,
    gcTime: 0,
  });

  const [selectedDomainOrganization, setSelectedDomainOrganization] = useState(
    '',
  );

  const goBackUrl = useGenerateUrl(accountId ? '../..' : '..', 'path');

  const onClose = () => {
    return navigate(goBackUrl);
  };

  const { data: domains, isLoading: isLoadingDomains } = useDomains({
    organizationId: emailAccount?.currentState?.organizationId,
    shouldFetchAll: true,
  });

  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackDomains, setHackDomains] = useState([]);
  const [hackKeyDomains, setHackKeyDomains] = useState(Date.now());

  useEffect(() => {
    setHackDomains(
      (domains || []).filter(
        (domain) => domain.resourceStatus === ResourceStatus.READY,
      ),
    );
    setHackKeyDomains(Date.now());
  }, [domains]);

  const { mutate: addOrEditEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (params: AccountBodyParamsType) => {
      return accountId
        ? putZimbraPlatformAccount(platformId, accountId, params)
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
            accountId
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
            accountId
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
          accountId && data.password === '' ? 'password' : '',
        ].includes(key)
      ) {
        payload[key] = value;
      }
    });

    addOrEditEmailAccount(payload as AccountBodyParamsType);
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      account: emailAccount?.currentState?.email?.split('@')[0] || '',
      domain: emailAccount?.currentState?.email?.split('@')[1] || '',
      firstName: emailAccount?.currentState?.firstName || '',
      lastName: emailAccount?.currentState?.lastName || '',
      displayName: emailAccount?.currentState?.displayName || '',
      password: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(
      accountId ? editEmailAccountSchema : addEmailAccountSchema,
    ),
  });

  useEffect(() => {
    if (emailAccount) {
      reset({
        account: emailAccount?.currentState?.email?.split('@')[0],
        domain: emailAccount?.currentState?.email?.split('@')[1],
        firstName: emailAccount?.currentState?.firstName,
        lastName: emailAccount?.currentState?.lastName,
        displayName: emailAccount?.currentState?.displayName,
        password: '',
      });
    }
  }, [emailAccount]);

  const setSelectedOrganization = (e: OdsSelectChangeEvent) => {
    const organizationLabel = domains?.find(
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
                  <div className="flex flex-1">
                    <OdsSelect
                      key={hackKeyDomains}
                      id={name}
                      name={field.name}
                      hasError={!!errors[field.name]}
                      value={field.value}
                      placeholder={t('common:select_domain')}
                      onOdsChange={(e) => {
                        field.onChange(e);
                        setSelectedOrganization(e);
                      }}
                      onOdsBlur={field.onBlur}
                      isDisabled={isLoadingDomains || !domains}
                      className="w-full"
                      data-testid="select-domain"
                    >
                      {hackDomains.map(({ currentState: domain }) => (
                        <option key={domain.name} value={domain.name}>
                          {domain.name}
                        </option>
                      ))}
                    </OdsSelect>
                    {(isLoadingDomains || !domains) && (
                      <Loading
                        className="flex justify-center"
                        size={ODS_SPINNER_SIZE.sm}
                      />
                    )}
                  </div>
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
                {!emailAccount && ' *'}
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

      <OdsButton
        slot="actions"
        type="submit"
        color={ODS_BUTTON_COLOR.primary}
        isDisabled={!isDirty || !isValid}
        isLoading={isSending}
        data-testid="confirm-btn"
        label={accountId ? t('common:save') : t('common:confirm')}
      />
    </form>
  );
}
