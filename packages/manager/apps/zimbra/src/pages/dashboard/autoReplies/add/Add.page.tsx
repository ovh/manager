import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Datepicker,
  DatepickerContent,
  DatepickerControl,
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  SPINNER_SIZE,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
  Textarea,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType, useFormatDate, useNotifications } from '@ovh-ux/muk';

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
  const format = useFormatDate();

  const goBackUrl = useGenerateUrl('..', 'href');

  const onClose = () => navigate(goBackUrl);

  const now = useMemo(() => {
    return new Date();
  }, []);

  const { data: domains, isLoading } = useDomains({
    enabled: !accountId,
    shouldFetchAll: true,
  });

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
        <Text preset={TEXT_PRESET.paragraph}>{t('zimbra_auto_replies_add_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_auto_replies_add_error_message', {
            error: error.response?.data?.message,
          })}
        </Text>,
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
      className="flex w-full flex-col space-y-5 md:w-3/4"
    >
      <Link
        type={LinkType.back}
        href={goBackUrl}
        onClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: [trackingName, BACK_PREVIOUS_PAGE],
          });
        }}
      >
        {t('zimbra_auto_replies_add_cta_back')}
      </Link>
      <Text preset={TEXT_PRESET.heading3}>{t('common:add_auto_reply')}</Text>
      {accountId && account && !isLoadingAccount && (
        <Text data-testid="create-for-account" preset={TEXT_PRESET.paragraph}>
          {t('zimbra_auto_replies_add_header_create_for_account')}
          <b> {account.currentState?.email}</b>
        </Text>
      )}
      <Text data-testid="page-header" preset={TEXT_PRESET.paragraph}>
        {t('zimbra_auto_replies_add_header')}
      </Text>
      <Text preset={TEXT_PRESET.caption}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</Text>
      {!accountId && (
        <Controller
          control={control}
          name="account"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField className="w-full" invalid={(isDirty || isTouched) && !!errors?.[name]}>
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_auto_replies_add_account_label')} *
              </FormFieldLabel>
              <div className="flex">
                <Input
                  type={INPUT_TYPE.text}
                  placeholder={t('common:alias')}
                  data-testid="input-account"
                  className="flex-1"
                  disabled={accountId ? true : null}
                  name={name}
                  invalid={(isDirty || isTouched) && !!errors[name]}
                  value={value}
                  defaultValue=""
                  onBlur={onBlur}
                  onChange={onChange}
                />
                <Input
                  type={INPUT_TYPE.text}
                  name="@"
                  value="@"
                  readOnly
                  disabled
                  className="input-at w-10"
                />
                <Controller
                  control={control}
                  name="domain"
                  render={({ field: { name, onBlur, onChange }, fieldState }) => (
                    <>
                      <Select
                        items={domains?.map(({ currentState: domain }) => ({
                          label: domain.name,
                          value: domain.name,
                        }))}
                        disabled={isLoading || accountId ? true : null}
                        name={name}
                        invalid={(fieldState.isDirty || fieldState.isTouched) && !!errors[name]}
                        onValueChange={(detail) => onChange(detail.value[0])}
                        onBlur={onBlur}
                        data-testid="select-domain"
                        className="flex-1"
                      >
                        <SelectControl placeholder={t('common:select_domain')} />
                        <SelectContent />
                      </Select>
                      {isLoading && (
                        <Loading className="flex justify-center" size={SPINNER_SIZE.sm} />
                      )}
                    </>
                  )}
                />
              </div>
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      )}
      <Controller
        control={control}
        name="duration"
        render={({ field, fieldState }) => (
          <FormField
            invalid={(fieldState.isDirty || fieldState.isTouched) && !!errors?.[field.name]}
          >
            <FormFieldLabel htmlFor={field.name} slot="label">
              {t('zimbra_auto_replies_add_duration_label')} *
            </FormFieldLabel>
            <RadioGroup value={field.value} onValueChange={field.onChange}>
              {durationChoices.map(({ value, key }) => (
                <Radio
                  id={value}
                  key={value}
                  value={value}
                  data-testid={value}
                  className="flex gap-4 leading-none"
                >
                  <RadioControl />
                  <RadioLabel>{t(key)}</RadioLabel>
                </Radio>
              ))}
            </RadioGroup>
            {(fieldState.isDirty || fieldState.isTouched) && errors?.[field.name]?.message && (
              <FormFieldError>{errors[field.name].message}</FormFieldError>
            )}
          </FormField>
        )}
      />
      {(formValues.duration as AutoReplyDurations) === AutoReplyDurations.TEMPORARY && (
        <div className="flex gap-4">
          <Controller
            control={control}
            name="from"
            render={({
              field: { name, value, onChange, onBlur },
              fieldState: { isDirty, isTouched },
            }) => (
              <FormField className="flex-1" invalid={(isDirty || isTouched) && !!errors?.[name]}>
                <FormFieldLabel htmlFor={name} slot="label">
                  {t('common:from')} *
                </FormFieldLabel>
                <Datepicker
                  name={name}
                  id={name}
                  data-testid={name}
                  placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
                  dateFormatter={({ date }) => format({ date, format: 'dd/mm/yyyy' })}
                  locale={locale}
                  invalid={(isDirty || isTouched) && !!errors[name]}
                  value={value}
                  min={now}
                  max={formValues.until || null}
                  onValueChange={onChange}
                  onBlur={onBlur}
                >
                  <DatepickerControl />
                  <DatepickerContent />
                </Datepicker>
                {(isDirty || isTouched) && errors?.[name]?.message && (
                  <FormFieldError>{errors[name].message}</FormFieldError>
                )}
              </FormField>
            )}
          />
          <Controller
            control={control}
            name="until"
            render={({
              field: { name, value, onChange, onBlur },
              fieldState: { isDirty, isTouched },
            }) => (
              <FormField className="flex-1" invalid={(isDirty || isTouched) && !!errors?.[name]}>
                <FormFieldLabel htmlFor={name} slot="label">
                  {t('common:until')} *
                </FormFieldLabel>
                <Datepicker
                  name={name}
                  id={name}
                  data-testid={name}
                  placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
                  dateFormatter={({ date }) => format({ date, format: 'dd/mm/yyyy' })}
                  locale={locale}
                  invalid={(isDirty || isTouched) && !!errors[name]}
                  value={value}
                  min={formValues.from || now}
                  onValueChange={onChange}
                  onBlur={onBlur}
                >
                  <DatepickerControl />
                  <DatepickerContent />
                </Datepicker>
                {(isDirty || isTouched) && errors?.[name]?.message && (
                  <FormFieldError>{errors[name].message}</FormFieldError>
                )}
              </FormField>
            )}
          />
        </div>
      )}
      <Controller
        control={control}
        name="sendCopy"
        render={({ field: { name, value, onChange }, fieldState: { isDirty, isTouched } }) => (
          <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
            <Checkbox
              id={name}
              name={name}
              value={value as unknown as string}
              checked={value}
              onCheckedChange={({ checked }) => onChange(checked)}
            >
              <CheckboxControl />
              <CheckboxLabel>{t('zimbra_auto_replies_add_send_copy_label')}</CheckboxLabel>
            </Checkbox>
            {(isDirty || isTouched) && errors?.[name]?.message && (
              <FormFieldError>{errors[name].message}</FormFieldError>
            )}
          </FormField>
        )}
      />
      {!!formValues.sendCopy && (
        <Controller
          control={control}
          name="sendCopyTo"
          render={({ field: { name, onChange, onBlur }, fieldState: { isDirty, isTouched } }) => (
            <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
              <Select
                items={orgAccounts?.map((org) => ({
                  label: org.currentState.email,
                  value: org.currentState.email,
                }))}
                id={name}
                name={name}
                data-testid="select-send-copy-to"
                invalid={(isDirty || isTouched) && !!errors[name]}
                className="w-1/2"
                disabled={!orgAccounts || isOrgAccountsLoading ? true : null}
                onValueChange={(detail) => onChange(detail.value[0])}
                onBlur={onBlur}
              >
                <SelectControl placeholder={t('zimbra_auto_replies_add_select_send_copy_to')} />
                <SelectContent />
              </Select>
              {isOrgAccountsLoading && (
                <Loading className="flex justify-center" size={SPINNER_SIZE.sm} />
              )}
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      )}
      <Controller
        control={control}
        name="message"
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <div className="flex flex-col">
            <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_auto_replies_add_message_label')} *
              </FormFieldLabel>
              <Textarea
                id={name}
                name={name}
                data-testid="message"
                value={value}
                placeholder={t('zimbra_auto_replies_add_message_placeholder')}
                invalid={(isDirty || isTouched) && !!errors[name]}
                onChange={onChange}
                onBlur={onBlur}
                style={{
                  resize: 'both',
                }}
              />
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
            <FormFieldHelper>{t('zimbra_auto_replies_add_message_helper')}</FormFieldHelper>
          </div>
        )}
      />
      <div className="flex space-x-5">
        <Button
          type="submit"
          slot="actions"
          color={BUTTON_COLOR.primary}
          variant={BUTTON_VARIANT.default}
          disabled={!isDirty || !isValid}
          loading={isSending}
          data-testid="confirm-btn"
        >
          {t(`${NAMESPACES.ACTIONS}:confirm`)}
        </Button>
      </div>
    </form>
  );
};

export default AddAutoReply;
