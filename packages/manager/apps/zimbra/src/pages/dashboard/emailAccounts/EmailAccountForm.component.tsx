import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  OdsSelectChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsMessage,
  OdsPassword,
  OdsSelect,
  OdsText,
  OdsTooltip,
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

import { GeneratePasswordButton, Loading } from '@/components';
import {
  AccountBodyParamsType,
  DomainType,
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

  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackDomains, setHackDomains] = useState<DomainType[]>([]);
  const [hackKeyDomains, setHackKeyDomains] = useState(Date.now());

  useEffect(() => {
    setHackDomains(
      (domains || []).filter((domain) => domain.resourceStatus === ResourceStatus.READY),
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
      onClose();
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(accountId ? 'zimbra_account_edit_error_message' : 'zimbra_account_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
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

  const setSelectedOrganization = (e: OdsSelectChangeEvent) => {
    const organizationLabel = domains?.find(
      ({ currentState }) => currentState.name === e?.detail?.value,
    )?.currentState.organizationLabel;
    setSelectedDomainOrganization(organizationLabel);
  };

  return (
    <form onSubmit={handleSubmit(handleSaveClick)} className="w-full space-y-4 md:w-3/4">
      <OdsText preset={ODS_TEXT_PRESET.caption} className="block">
        {t(`${NAMESPACES.FORM}:mandatory_fields`)}
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
                      <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
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
        <OdsMessage className="w-full" isDismissible={false} color={ODS_MESSAGE_COLOR.information}>
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
            <OdsFormField className="w-full pr-6 md:w-1/2" error={errors?.[name]?.message}>
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
            <OdsFormField className="w-full pl-6 md:w-1/2" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_firstName_label')}
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                placeholder={t('zimbra_account_add_input_firstName_placeholder')}
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
      <div className="flex">
        <Controller
          control={control}
          name="displayName"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full md:w-1/2 md:pr-6" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_displayName_label')}
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                placeholder={t('zimbra_account_add_input_displayName_placeholder')}
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
          name="hideInGal"
          render={({ field: { name, value, onChange } }) => (
            <OdsFormField
              className="mt-7 flex w-full justify-center md:w-1/2 md:pl-6"
              error={errors?.[name]?.message}
            >
              <div className="flex gap-4 leading-none">
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
                    {t('zimbra_account_add_checkbox_hide_in_gal')}
                    <OdsIcon
                      id="tooltip-hide-in-gal"
                      className="ml-3 text-xs"
                      name={ODS_ICON_NAME.circleQuestion}
                    ></OdsIcon>
                    <OdsTooltip role="tooltip" strategy="fixed" triggerId="tooltip-hide-in-gal">
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        {t('zimbra_account_add_checkbox_hide_in_gal_tooltip')}
                      </OdsText>
                    </OdsTooltip>
                  </OdsText>
                </label>
              </div>
            </OdsFormField>
          )}
        />
      </div>
      <div className="flex">
        <Controller
          control={control}
          name="password"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full md:w-1/2 md:pr-6" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_account_add_input_password_label')}
                {!emailAccount && ' *'}
              </label>
              <div className="flex flex-1 gap-4">
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
                <GeneratePasswordButton
                  id="generate-password-btn"
                  onGenerate={(password) => {
                    setValue('password', password);
                  }}
                />
              </div>
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="forceChangePasswordAfterLogin"
          render={({ field: { name, value, onChange } }) => (
            <OdsFormField
              className="mt-7 flex w-full justify-center md:w-1/2 md:pl-6"
              error={errors?.[name]?.message}
            >
              <div className="flex gap-4 leading-none">
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
                    {t('zimbra_account_add_checkbox_force_change_password')}
                    <OdsIcon
                      id="tooltip-trigger"
                      className="ml-3 text-xs"
                      name={ODS_ICON_NAME.circleQuestion}
                    ></OdsIcon>
                    <OdsTooltip role="tooltip" strategy="fixed" triggerId="tooltip-trigger">
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        {t('zimbra_account_add_checkbox_force_change_password_tooltip')}
                      </OdsText>
                    </OdsTooltip>
                  </OdsText>
                </label>
              </div>
            </OdsFormField>
          )}
        />
      </div>
      <OdsText preset={ODS_TEXT_PRESET.caption} className="flex flex-col">
        <span className="block">{t('zimbra_account_add_input_password_helper')}</span>
        {[1, 2, 3].map((elm) => (
          <span key={elm} className="block">
            - {t(`zimbra_account_add_input_password_helper_rule_${elm}`)}
          </span>
        ))}
      </OdsText>
      {!accountId && (
        <div className="flex w-full md:w-1/2">
          <Controller
            control={control}
            name="offer"
            render={({ field: { name, value, onChange, onBlur } }) => (
              <OdsFormField className="w-full md:pr-6" error={errors?.[name]?.message}>
                <label htmlFor={name} slot="label">
                  {t('common:offer')}
                  {' *'}
                </label>
                <div className="flex flex-1">
                  <OdsSelect
                    id={name}
                    name={name}
                    hasError={!!errors[name]}
                    value={value}
                    placeholder={t('common:select_slot')}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                    isDisabled={isLoadingSlots}
                    className="w-full"
                    data-testid="select-slot"
                  >
                    {Object.keys(groupedSlots).map((offer) => (
                      <option key={offer} value={offer}>
                        {`${capitalize(offer.toLowerCase())} (${groupedSlots[offer].length})`}
                      </option>
                    ))}
                  </OdsSelect>
                  {isLoadingSlots && (
                    <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
                  )}
                </div>
              </OdsFormField>
            )}
          />
        </div>
      )}
      <OdsButton
        slot="actions"
        type="submit"
        color={ODS_BUTTON_COLOR.primary}
        isDisabled={!isDirty || !isValid}
        isLoading={isSending}
        data-testid="confirm-btn"
        label={accountId ? t(`${NAMESPACES.ACTIONS}:save`) : t(`${NAMESPACES.ACTIONS}:confirm`)}
      />
    </form>
  );
};

export default EmailAccountForm;
