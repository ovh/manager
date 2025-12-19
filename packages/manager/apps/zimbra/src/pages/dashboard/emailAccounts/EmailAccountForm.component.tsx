import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Password,
  SPINNER_SIZE,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';

import { GeneratePasswordButton, Loading } from '@/components';
import {
  AccountBodyParamsType,
  ResourceStatus,
  ZimbraOffer,
  formatAccountPayload,
  getZimbraPlatformAccountDetailQueryKey,
  getZimbraPlatformListQueryKey,
  postZimbraPlatformAccount,
  putZimbraPlatformAccount,
} from '@/data/api';
import { SlotWithService, useAccount, useDomains, useSlotsWithService } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { ADD_EMAIL_ACCOUNT, CONFIRM, EDIT_EMAIL_ACCOUNT } from '@/tracking.constants';
import {
  AddEmailAccountSchema,
  addEmailAccountSchema,
  capitalize,
  editEmailAccountSchema,
  groupBy,
} from '@/utils';

export const EmailAccountForm = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts/form', 'common', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { platformId, accountId } = useParams();
  const trackingName = accountId ? EDIT_EMAIL_ACCOUNT : ADD_EMAIL_ACCOUNT;

  const { data: emailAccount } = useAccount({
    accountId,
    enabled: !!accountId,
    gcTime: 0,
  });

  const { slots, isLoadingSlots } = useSlotsWithService({
    gcTime: 0,
    enabled: !accountId,
    used: 'false',
    shouldFetchAll: true,
  });

  const groupedSlots: Record<string, SlotWithService[]> = useMemo(() => {
    // group slots by offer
    const groupedSlots = groupBy<keyof typeof ZimbraOffer, SlotWithService>(
      slots,
      (slot) => slot.offer,
    );
    // we need to sort the dates manually because slots API
    // doesn't take into account the renewal date
    Object.keys(groupedSlots).forEach((offer: keyof typeof ZimbraOffer) => {
      groupedSlots[offer] = groupedSlots[offer].sort(
        (a, b) =>
          new Date(b.service?.nextBillingDate || 0).getTime() -
          new Date(a.service?.nextBillingDate || 0).getTime(),
      );
    });
    return groupedSlots;
  }, [slots]);

  const [selectedDomainOrganization, setSelectedDomainOrganization] = useState('');

  const goBackUrl = useGenerateUrl(accountId ? '../..' : '..', 'path');

  const onClose = () => {
    return navigate(goBackUrl);
  };

  const { data: domains, isLoading: isLoadingDomains } = useDomains({
    gcTime: 0,
    organizationId: emailAccount?.currentState?.organizationId,
    shouldFetchAll: true,
  });

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
        <Text preset={TEXT_PRESET.paragraph}>
          {t(
            accountId
              ? 'zimbra_account_edit_success_message'
              : 'zimbra_account_add_success_message',
          )}
        </Text>,
        true,
      );
      onClose();
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(accountId ? 'zimbra_account_edit_error_message' : 'zimbra_account_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          getZimbraPlatformListQueryKey(),
          getZimbraPlatformAccountDetailQueryKey(platformId, accountId),
        ],
      });
    },
  });

  const handleSaveClick: SubmitHandler<AddEmailAccountSchema> = (data) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });
    let updatedData = null;
    if (typeof data.offer === 'string' && groupedSlots?.[data.offer]) {
      const selectedSlot = groupedSlots?.[data.offer]?.[0];
      updatedData = { ...data, slotId: selectedSlot.id };
    }
    return addOrEditEmailAccount(formatAccountPayload(updatedData ?? data, !!accountId));
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, errors },
    setValue,
  } = useForm({
    defaultValues: {
      account: emailAccount?.currentState?.email?.split('@')[0] || '',
      domain: emailAccount?.currentState?.email?.split('@')[1] || '',
      firstName: emailAccount?.currentState?.firstName || '',
      lastName: emailAccount?.currentState?.lastName || '',
      displayName: emailAccount?.currentState?.displayName || '',
      password: '',
      hideInGal: emailAccount?.currentState?.hideInGal || false,
      forceChangePasswordAfterLogin: !accountId,
      offer: emailAccount?.currentState?.offer,
    },
    mode: 'onTouched',
    resolver: zodResolver(accountId ? editEmailAccountSchema : addEmailAccountSchema),
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
        hideInGal: emailAccount?.currentState?.hideInGal,
        forceChangePasswordAfterLogin: !accountId,
        offer: emailAccount?.currentState?.offer,
      });
    }
  }, [emailAccount]);

  const setSelectedOrganization = (value: string) => {
    const organizationLabel = domains?.find(({ currentState }) => currentState.name === value)
      ?.currentState.organizationLabel;
    setSelectedDomainOrganization(organizationLabel);
  };

  return (
    <form onSubmit={handleSubmit(handleSaveClick)} className="w-full space-y-4 md:w-3/4">
      <Text preset={TEXT_PRESET.caption} className="block">
        {t(`${NAMESPACES.FORM}:mandatory_fields`)}
      </Text>
      <Controller
        control={control}
        name="account"
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <FormField className="w-full" invalid={(isDirty || isTouched) && !!errors?.[name]}>
            <label htmlFor={name} slot="label">
              {t('common:email_address')} *
            </label>
            <div className="flex">
              <Input
                type={INPUT_TYPE.text}
                placeholder={t('common:account_name')}
                data-testid="input-account"
                className="flex-1"
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors[name]}
                value={value}
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
                render={({ field, fieldState }) => (
                  <div className="flex flex-1">
                    <Select
                      items={domains
                        ?.filter((domain) => domain.resourceStatus === ResourceStatus.READY)
                        .map(({ currentState: domain }) => ({
                          label: domain.name,
                          value: domain.name,
                        }))}
                      id={name}
                      name={field.name}
                      invalid={(fieldState.isDirty || fieldState.isTouched) && !!errors[field.name]}
                      value={[field.value]}
                      onValueChange={({ value }) => {
                        field.onChange(value[0]);
                        setSelectedOrganization(value[0]);
                      }}
                      onBlur={field.onBlur}
                      disabled={isLoadingDomains || !domains || !!accountId}
                      className="w-full"
                      data-testid="select-domain"
                    >
                      <SelectControl placeholder={t('common:select_domain')} />
                      <SelectContent />
                    </Select>
                    {(isLoadingDomains || !domains) && (
                      <Loading className="flex justify-center" size={SPINNER_SIZE.sm} />
                    )}
                  </div>
                )}
              />
            </div>
            {(isDirty || isTouched) && errors?.[name]?.message && (
              <FormFieldError>{errors[name].message}</FormFieldError>
            )}
          </FormField>
        )}
      />
      <Text preset={TEXT_PRESET.caption} className="flex flex-col">
        <span className="block">{t('common:form_email_helper')}</span>
        {[1, 2, 3].map((elm) => (
          <span key={elm} className="block">
            - {t(`common:form_email_helper_rule_${elm}`)}
          </span>
        ))}
      </Text>
      {selectedDomainOrganization && (
        <Message className="w-full" dismissible={false} color={MESSAGE_COLOR.information}>
          <MessageIcon name={ICON_NAME.circleInfo} />
          <MessageBody>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('zimbra_account_add_message_organization', {
                organizationLabel: selectedDomainOrganization,
              })}
            </Text>
          </MessageBody>
        </Message>
      )}
      <div className="flex">
        <Controller
          control={control}
          name="lastName"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="w-full pr-6 md:w-1/2"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
            >
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_account_add_input_lastName_label')}
              </FormFieldLabel>
              <Input
                placeholder={t('zimbra_account_add_input_lastName_placeholder')}
                type={INPUT_TYPE.text}
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors[name]}
                value={value}
                defaultValue=""
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="firstName"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="w-full pl-6 md:w-1/2"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
            >
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_account_add_input_firstName_label')}
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                placeholder={t('zimbra_account_add_input_firstName_placeholder')}
                name={name}
                invalid={(isDirty || isTouched) && !!errors[name]}
                value={value}
                defaultValue=""
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      </div>
      <div className="flex">
        <Controller
          control={control}
          name="displayName"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="w-full md:w-1/2 md:pr-6"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
            >
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_account_add_input_displayName_label')}
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                placeholder={t('zimbra_account_add_input_displayName_placeholder')}
                name={name}
                invalid={(isDirty || isTouched) && !!errors[name]}
                value={value}
                defaultValue=""
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="hideInGal"
          render={({ field: { name, value, onChange }, fieldState: { isDirty, isTouched } }) => (
            <FormField
              className="mt-7 flex w-full justify-center md:w-1/2 md:pl-6"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
            >
              <Checkbox
                id={name}
                name={name}
                value={value as unknown as string}
                checked={value}
                onCheckedChange={(detail) => onChange(detail.checked)}
              >
                <CheckboxControl />
                <CheckboxLabel>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t('zimbra_account_add_checkbox_hide_in_gal')}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon className="ml-3 text-xs" name={ICON_NAME.circleQuestion} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {t('zimbra_account_add_checkbox_hide_in_gal_tooltip')}
                        </Text>
                      </TooltipContent>
                    </Tooltip>
                  </Text>
                </CheckboxLabel>
              </Checkbox>
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      </div>
      <div className="flex">
        <Controller
          control={control}
          name="password"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              className="w-full md:w-1/2 md:pr-6"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
            >
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_account_add_input_password_label')}
                {!emailAccount && ' *'}
              </FormFieldLabel>
              <div className="flex flex-1 gap-4">
                <Password
                  data-testid="input-password"
                  className="w-full"
                  id={name}
                  name={name}
                  invalid={(isDirty || isTouched) && !!errors[name]}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
                <GeneratePasswordButton
                  id="generate-password-btn"
                  onGenerate={(password) => {
                    setValue('password', password, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </div>
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="forceChangePasswordAfterLogin"
          render={({ field: { name, value, onChange }, fieldState: { isDirty, isTouched } }) => (
            <FormField
              className="mt-7 flex w-full justify-center md:w-1/2 md:pl-6"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
            >
              <Checkbox
                id={name}
                name={name}
                value={value as unknown as string}
                checked={value}
                onCheckedChange={(detail) => onChange(detail.checked)}
              >
                <CheckboxControl />
                <CheckboxLabel>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t('zimbra_account_add_checkbox_force_change_password')}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Icon className="ml-3 text-xs" name={ICON_NAME.circleQuestion} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {t('zimbra_account_add_checkbox_force_change_password_tooltip')}
                        </Text>
                      </TooltipContent>
                    </Tooltip>
                  </Text>
                </CheckboxLabel>
              </Checkbox>
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      </div>
      <Text preset={TEXT_PRESET.caption} className="flex flex-col">
        <span className="block">{t('zimbra_account_add_input_password_helper')}</span>
        {[1, 2, 3].map((elm) => (
          <span key={elm} className="block">
            - {t(`zimbra_account_add_input_password_helper_rule_${elm}`)}
          </span>
        ))}
      </Text>
      {!accountId && (
        <div className="flex w-full md:w-1/2">
          <Controller
            control={control}
            name="offer"
            render={({
              field: { name, value, onChange, onBlur },
              fieldState: { isDirty, isTouched },
            }) => (
              <FormField
                className="w-full md:pr-6"
                invalid={(isDirty || isTouched) && !!errors?.[name]}
              >
                <FormFieldLabel htmlFor={name} slot="label">
                  {t('common:offer')}
                  {' *'}
                </FormFieldLabel>
                <div className="flex flex-1">
                  <Select
                    items={Object.keys(groupedSlots).map((offer) => {
                      return {
                        label: `${capitalize(offer.toLowerCase())} (${groupedSlots[offer].length})`,
                        value: offer,
                      };
                    })}
                    id={name}
                    name={name}
                    invalid={(isDirty || isTouched) && !!errors[name]}
                    value={[value]}
                    onValueChange={(detail) => onChange(detail.value[0])}
                    onBlur={onBlur}
                    disabled={isLoadingSlots}
                    className="w-full"
                    data-testid="select-slot"
                  >
                    <SelectControl placeholder={t('common:select_slot')} />
                    <SelectContent />
                  </Select>
                  {isLoadingSlots && (
                    <Loading className="flex justify-center" size={SPINNER_SIZE.sm} />
                  )}
                </div>
                {(isDirty || isTouched) && errors?.[name]?.message && (
                  <FormFieldError>{errors[name].message}</FormFieldError>
                )}
              </FormField>
            )}
          />
        </div>
      )}
      <Button
        slot="actions"
        type="submit"
        color={BUTTON_COLOR.primary}
        disabled={!isDirty || !isValid}
        loading={isSending}
        data-testid="confirm-btn"
      >
        {accountId ? t(`${NAMESPACES.ACTIONS}:save`) : t(`${NAMESPACES.ACTIONS}:confirm`)}
      </Button>
    </form>
  );
};

export default EmailAccountForm;
