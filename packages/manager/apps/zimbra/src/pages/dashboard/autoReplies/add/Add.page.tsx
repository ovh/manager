import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_DATEPICKER_LOCALE,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsDatepicker,
  OdsFormField,
  OdsInput,
  OdsRadio,
  OdsSelect,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  IconLinkAlignmentType,
  LinkType,
  Links,
  Subtitle,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { Loading } from '@/components';
import { useAccount, useAccounts, useDomains } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import {
  ADD_AUTO_REPLY,
  BACK_PREVIOUS_PAGE,
  CONFIRM,
  EMAIL_ACCOUNT_ADD_AUTO_REPLY,
} from '@/tracking.constants';
import { AutoReplySchema, autoReplySchema } from '@/utils';

export enum AutoReplyDurations {
  TEMPORARY = 'temporary',
  PERMANENT = 'permanent',
}

const durationChoices = [
  {
    value: AutoReplyDurations.TEMPORARY,
    key: 'zimbra_auto_replies_add_duration_temporary',
  },
  {
    value: AutoReplyDurations.PERMANENT,
    key: 'zimbra_auto_replies_add_duration_permanent',
  },
];

export const AddAutoReply = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation([
    'auto-replies/form',
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const { accountId } = useParams();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  const trackingName = accountId ? EMAIL_ACCOUNT_ADD_AUTO_REPLY : ADD_AUTO_REPLY;
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(organizationId);

  const goBackUrl = useGenerateUrl('..', 'href');

  const onClose = () => navigate(goBackUrl);

  const now = useMemo(() => {
    return new Date();
  }, []);

  const { data: domains, isLoading } = useDomains({
    enabled: !accountId,
    shouldFetchAll: true,
  });

  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackKeyDomains, setHackKeyDomains] = useState(Date.now());

  useEffect(() => {
    setHackKeyDomains(Date.now());
  }, [domains]);

  const { data: account, isLoading: isLoadingAccount } = useAccount({
    accountId,
    enabled: !!accountId,
  });

  const { mutate: addAutoReply, isPending: isSending } = useMutation({
    mutationFn: (payload: AutoReplySchema) => {
      // call api
      return Promise.resolve(payload);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_auto_replies_add_success_message')}
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
          {t('zimbra_auto_replies_add_error_message', {
            error: error.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      /* queryClient.invalidateQueries({
        queryKey: getZimbraPlatformMailingListsQueryKey(platformId),
      }); */
      onClose();
    },
  });

  const {
    control,
    handleSubmit,
    resetField,
    watch,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      account: account?.currentState?.email?.split('@')[0] || '',
      domain: account?.currentState?.email?.split('@')[1] || '',
      message: '',
      duration: AutoReplyDurations.TEMPORARY,
      from: null,
      until: null,
      sendCopy: false,
      sendCopyTo: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(autoReplySchema),
  });

  useEffect(() => {
    if (account) {
      const [head, tail] = (account?.currentState?.email || '@').split('@');
      resetField('account', { defaultValue: head });
      resetField('domain', { defaultValue: tail });
      setSelectedOrganizationId(account?.currentState?.organizationId);
    }
  }, [account]);

  const formValues = watch();

  const selectedDomain = useMemo(() => {
    return domains?.find((domain) => formValues.domain === domain.currentState?.name);
  }, [domains, formValues.domain]);

  useEffect(() => {
    const orgId = selectedDomain?.currentState?.organizationId;
    if (selectedDomain && selectedOrganizationId !== orgId) {
      setSelectedOrganizationId(orgId);
      queryClient.invalidateQueries({
        queryKey: ['get', 'account'],
      });
    }
  }, [selectedDomain]);

  const { data: orgAccounts, isLoading: isOrgAccountsLoading } = useAccounts({
    enabled: !!formValues.sendCopy && !!selectedOrganizationId,
    organizationId: selectedOrganizationId,
    shouldFetchAll: true,
  });

  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackKeyOrgAccounts, setHackKeyOrgAccounts] = useState(Date.now());

  useEffect(() => {
    setHackKeyOrgAccounts(Date.now());
  }, [orgAccounts, selectedDomain]);

  const handleSavelick: SubmitHandler<AutoReplySchema> = (data) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });

    addAutoReply(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSavelick)}
      className="w-full md:w-3/4 flex flex-col space-y-5"
    >
      <Links
        type={LinkType.back}
        href={goBackUrl}
        onClickReturn={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [trackingName, BACK_PREVIOUS_PAGE],
          });
        }}
        iconAlignment={IconLinkAlignmentType.left}
        label={t('zimbra_auto_replies_add_cta_back')}
      />
      <Subtitle>{t('common:add_auto_reply')}</Subtitle>
      {accountId && account && !isLoadingAccount && (
        <OdsText data-testid="create-for-account" preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_auto_replies_add_header_create_for_account')}
          <b> {account.currentState?.email}</b>
        </OdsText>
      )}
      <OdsText data-testid="page-header" preset={ODS_TEXT_PRESET.paragraph}>
        {t('zimbra_auto_replies_add_header')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</OdsText>
      {!accountId && (
        <Controller
          control={control}
          name="account"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_auto_replies_add_account_label')} *
              </label>
              <div className="flex">
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  placeholder={t('common:alias')}
                  data-testid="input-account"
                  className="flex-1"
                  isDisabled={accountId ? true : null}
                  name={name}
                  hasError={!!errors[name]}
                  value={value}
                  defaultValue=""
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
                        isDisabled={isLoading || accountId ? true : null}
                        name={field.name}
                        hasError={!!errors[field.name]}
                        value={field.value}
                        placeholder={t('common:select_domain')}
                        onOdsChange={field.onChange}
                        onOdsBlur={field.onBlur}
                        data-testid="select-domain"
                        className="flex-1"
                      >
                        {domains?.map(({ currentState: domain }) => (
                          <option key={domain.name} value={domain.name}>
                            {domain.name}
                          </option>
                        ))}
                      </OdsSelect>
                      {isLoading && (
                        <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
                      )}
                    </div>
                  )}
                />
              </div>
            </OdsFormField>
          )}
        />
      )}
      <Controller
        control={control}
        name="duration"
        render={({ field }) => (
          <OdsFormField error={errors?.[field.name]?.message}>
            <label htmlFor={field.name} slot="label">
              {t('zimbra_auto_replies_add_duration_label')} *
            </label>
            {durationChoices.map(({ value, key }) => (
              <div key={value} className="flex leading-none gap-4">
                <OdsRadio
                  id={value}
                  name={value}
                  value={value}
                  isChecked={field.value === value}
                  onOdsChange={field.onChange}
                  data-testid={value}
                  className="cursor-pointer"
                ></OdsRadio>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(key)}</OdsText>
              </div>
            ))}
          </OdsFormField>
        )}
      />
      {formValues.duration === AutoReplyDurations.TEMPORARY && (
        <div className="flex gap-4">
          <Controller
            control={control}
            name="from"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="flex-1" error={errors?.[name]?.message}>
                <label htmlFor={name} slot="label">
                  {t('common:from')} *
                </label>
                <OdsDatepicker
                  name={name}
                  id={name}
                  data-testid={name}
                  placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
                  format="dd/mm/yyyy"
                  locale={locale as ODS_DATEPICKER_LOCALE}
                  hasError={!!errors[name]}
                  value={value}
                  min={now}
                  max={formValues.until || null}
                  onOdsChange={onChange}
                  onBlur={onBlur}
                ></OdsDatepicker>
              </OdsFormField>
            )}
          />
          <Controller
            control={control}
            name="until"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="flex-1" error={errors?.[name]?.message}>
                <label htmlFor={name} slot="label">
                  {t('common:until')} *
                </label>
                <OdsDatepicker
                  name={name}
                  id={name}
                  data-testid={name}
                  placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
                  format="dd/mm/yyyy"
                  locale={locale as ODS_DATEPICKER_LOCALE}
                  hasError={!!errors[name]}
                  value={value}
                  min={formValues.from || now}
                  onOdsChange={onChange}
                  onBlur={onBlur}
                ></OdsDatepicker>
              </OdsFormField>
            )}
          />
        </div>
      )}
      <Controller
        control={control}
        name="sendCopy"
        render={({ field: { name, value, onChange } }) => (
          <OdsFormField error={errors?.[name]?.message}>
            <div className="flex leading-none gap-4">
              <OdsCheckbox
                inputId={name}
                id={name}
                name={name}
                value={value as unknown as string}
                isChecked={value}
                onClick={() => onChange(!value)}
              ></OdsCheckbox>
              <label htmlFor={name}>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {t('zimbra_auto_replies_add_send_copy_label')}
                </OdsText>
              </label>
            </div>
          </OdsFormField>
        )}
      />
      {!!formValues.sendCopy && (
        <Controller
          control={control}
          name="sendCopyTo"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField error={errors?.[name]?.message}>
              <div className="flex">
                <OdsSelect
                  key={hackKeyOrgAccounts}
                  id={name}
                  name={name}
                  data-testid="select-send-copy-to"
                  placeholder={t('zimbra_auto_replies_add_select_send_copy_to')}
                  value={value}
                  hasError={!!errors[name]}
                  className="w-1/2"
                  isDisabled={!orgAccounts || isOrgAccountsLoading ? true : null}
                  onOdsChange={onChange}
                  onOdsBlur={onBlur}
                >
                  {(orgAccounts || []).map(({ currentState: acc }, index) => (
                    <option key={`copy-${acc.email}-${index}`} value={acc.email}>
                      {acc.email}
                    </option>
                  ))}
                </OdsSelect>
                {isOrgAccountsLoading && (
                  <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
                )}
              </div>
            </OdsFormField>
          )}
        />
      )}
      <Controller
        control={control}
        name="message"
        render={({ field: { name, value, onChange, onBlur } }) => (
          <div className="flex flex-col">
            <OdsFormField error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_auto_replies_add_message_label')} *
              </label>
              <OdsTextarea
                id={name}
                name={name}
                data-testid="message"
                value={value}
                placeholder={t('zimbra_auto_replies_add_message_placeholder')}
                hasError={!!errors[name]}
                onOdsChange={onChange}
                onBlur={onBlur}
                isResizable
              ></OdsTextarea>
            </OdsFormField>
            <OdsText preset={ODS_TEXT_PRESET.caption}>
              {t('zimbra_auto_replies_add_message_helper')}
            </OdsText>
          </div>
        )}
      />
      <div className="flex space-x-5">
        <OdsButton
          type="submit"
          slot="actions"
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.default}
          isDisabled={!isDirty || !isValid}
          isLoading={isSending}
          data-testid="confirm-btn"
          label={t(`${NAMESPACES.ACTIONS}:confirm`)}
        ></OdsButton>
      </div>
    </form>
  );
};

export default AddAutoReply;
