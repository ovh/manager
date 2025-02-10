import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  IconLinkAlignmentType,
  Links,
  LinkType,
  Subtitle,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsRadio,
  OdsSelect,
  OdsText,
  OdsTextarea,
  OdsDatepicker,
  OdsCheckbox,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_DATEPICKER_LOCALE,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  useAccount,
  useAccountList,
  useDomains,
  useGenerateUrl,
} from '@/hooks';
import { ACCOUNT_REGEX, makeDateFromDDMMYYYY } from '@/utils';
import Loading from '@/components/Loading/Loading';
import {
  ADD_AUTO_REPLY,
  BACK_PREVIOUS_PAGE,
  CANCEL,
  CONFIRM,
  EMAIL_ACCOUNT_ADD_AUTO_REPLY,
} from '@/tracking.constant';
import { FormTypeInterface, useForm } from '@/hooks/useForm';
import queryClient from '@/queryClient';

export enum AutoReplyTypes {
  LINKED = 'linked',
  FREE = 'free',
}

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

export default function AddAutoReply() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['auto-replies/form', 'common']);
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const organizationId = searchParams.get('organizationId');
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const trackingName = editEmailAccountId
    ? EMAIL_ACCOUNT_ADD_AUTO_REPLY
    : ADD_AUTO_REPLY;
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(
    organizationId,
  );

  const goBackUrl = useGenerateUrl('..', 'path', params);

  const onClose = () => navigate(goBackUrl);

  const { form, isFormValid, setValue } = useForm(
    {
      ...{
        account: {
          value: '',
          defaultValue: '',
          required: true,
          validate: ACCOUNT_REGEX,
        },
        domain: {
          value: '',
          required: true,
        },
        duration: {
          value: AutoReplyDurations.TEMPORARY,
          required: true,
        },
        from: {
          value: '',
          required: true,
        },
        until: {
          value: '',
          required: true,
        },
        sendCopy: {
          value: '',
        },
        sendCopyTo: {
          value: '',
        },
        message: {
          value: '',
          defaultValue: '',
          required: true,
        },
      },
    },
    {
      onValueChange: (currentForm, name) => {
        const newForm = currentForm;
        if (name === 'sendCopy') {
          newForm.sendCopyTo.required = !!newForm.sendCopy.value;
          newForm.sendCopyTo.hasError = false;
        }
        if (name === 'duration') {
          newForm.from.required =
            newForm.duration.value === AutoReplyDurations.TEMPORARY;
          newForm.until.required =
            newForm.duration.value === AutoReplyDurations.TEMPORARY;
        }
        return newForm;
      },
    },
  );

  const fromDate = useMemo(() => {
    return form.from.value ? makeDateFromDDMMYYYY(form.from.value) : undefined;
  }, [form.from]);

  const untilDate = useMemo(() => {
    return form.until.value
      ? makeDateFromDDMMYYYY(form.until.value)
      : undefined;
  }, [form.until]);

  const now = useMemo(() => {
    return new Date();
  }, []);

  const getDataBody = useCallback(
    (formRef: FormTypeInterface) => {
      const {
        account: { value: account },
        domain: { value: domain },
      } = form;

      let dataBody = {
        email: `${account}@${domain}`,
      };

      Object.entries(formRef).forEach(([key, { value }]) => {
        if (!['account', 'domain'].includes(key)) {
          dataBody = { ...dataBody, [key]: value };
        }
      });

      return dataBody;
    },
    [form],
  );

  const { data: domains, isLoading } = useDomains({
    enabled: !editEmailAccountId,
    shouldFetchAll: true,
  });

  const selectedDomain = useMemo(() => {
    return domains?.find(
      (domain) => form.domain.value === domain.currentState?.name,
    );
  }, [domains, form.domain.value]);

  const { data: domainAccounts } = useAccountList({
    enabled: !editEmailAccountId && !!selectedDomain,
    domainId: selectedDomain?.id,
    shouldFetchAll: true,
  });

  const { data: orgAccounts, isLoading: isOrgAccountsLoading } = useAccountList(
    {
      enabled: !!form.sendCopy.value && !!selectedOrganizationId,
      organizationId: selectedOrganizationId,
      shouldFetchAll: true,
    },
  );

  const { data: account, isLoading: isLoadingAccount } = useAccount({
    accountId: editEmailAccountId,
    enabled: !!editEmailAccountId,
  });

  useEffect(() => {
    if (account) {
      const [head, tail] = (account.currentState?.email || '@').split('@');
      setValue('account', head);
      setValue('domain', tail);
      setSelectedOrganizationId(account.currentState?.organizationId);
    }
  }, [account]);

  useEffect(() => {
    const orgId = selectedDomain?.currentState?.organizationId;
    if (selectedDomain && selectedOrganizationId !== orgId) {
      setSelectedOrganizationId(orgId);
      queryClient.invalidateQueries({
        queryKey: ['get', 'account'],
      });
    }
  }, [selectedDomain]);

  const { mutate: addAutoReply, isPending: isSending } = useMutation({
    mutationFn: (payload: Record<string, string>) => {
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

  const handleSavelick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });
    addAutoReply(getDataBody(form));
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

  return (
    <div className="w-full md:w-3/4 flex flex-col space-y-5">
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
      {editEmailAccountId && account && !isLoadingAccount && (
        <OdsText
          data-testid="create-for-account"
          preset={ODS_TEXT_PRESET.paragraph}
        >
          {t('zimbra_auto_replies_add_header_create_for_account')}
          <b> {account.currentState?.email}</b>
        </OdsText>
      )}
      <OdsText data-testid="page-header" preset={ODS_TEXT_PRESET.paragraph}>
        {t('zimbra_auto_replies_add_header')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption}>
        {t('common:form_mandatory_fields')}
      </OdsText>
      {!editEmailAccountId && (
        <OdsFormField>
          <label htmlFor="account" slot="label">
            {t('zimbra_auto_replies_add_account_label')} *
          </label>
          <div className="flex">
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              id="account"
              name="account"
              list="list"
              hasError={form.account.hasError}
              value={form.account.value}
              defaultValue={form.account.defaultValue}
              className="w-1/2"
              data-testid="input-account"
              isDisabled={editEmailAccountId ? true : null}
              onOdsBlur={(event) =>
                setValue(event.target.name, event.target.value.toString(), true)
              }
              onOdsChange={(event) => {
                setValue(event.detail.name, event.detail.value.toString());
              }}
            >
              <datalist slot="list">
                {(domainAccounts || []).map((acc, index) => {
                  const [head] = (acc.currentState?.email || '@').split('@');
                  return (
                    <option
                      key={`account-${head}-${index}`}
                      value={head}
                    ></option>
                  );
                })}
              </datalist>
            </OdsInput>
            <OdsInput
              name="@"
              type={ODS_INPUT_TYPE.text}
              value={'@'}
              isReadonly
              isDisabled
              className="w-10 input-at"
            ></OdsInput>
            <OdsSelect
              id="domain"
              name="domain"
              value={form.domain.value}
              className="w-1/2"
              hasError={form.from.hasError}
              isDisabled={isLoading || editEmailAccountId ? true : null}
              onOdsChange={(event) =>
                setValue('domain', event.detail.value as string)
              }
              data-testid="select-domain"
              placeholder={t('common:select_domain')}
            >
              {(domains || []).map(({ currentState: domain }, index) => (
                <option
                  key={`domain-${domain.name}-${index}`}
                  value={domain.name}
                >
                  {domain.name}
                </option>
              ))}
            </OdsSelect>
            {isLoading && <Loading size={ODS_SPINNER_SIZE.sm} />}
          </div>
        </OdsFormField>
      )}
      <OdsFormField>
        <label htmlFor="duration" slot="label">
          {t('zimbra_auto_replies_add_duration_label')} *
        </label>
        {durationChoices.map(({ value, key }) => (
          <div key={value} className="flex leading-none gap-4">
            <OdsRadio
              id={value}
              name={value}
              value={value}
              isChecked={form.duration.value === value}
              onOdsChange={(event) => setValue('duration', event.detail.value)}
              data-testid={value}
              className="cursor-pointer"
            ></OdsRadio>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(key)}</OdsText>
          </div>
        ))}
      </OdsFormField>
      {form.duration.value === AutoReplyDurations.TEMPORARY && (
        <div className="flex gap-4">
          <OdsFormField className="w-1/2">
            <label htmlFor="from" slot="label">
              {t('common:from')} *
            </label>
            <OdsDatepicker
              name="from"
              id="from"
              data-testid="from"
              placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
              format="dd/mm/yyyy"
              locale={locale as ODS_DATEPICKER_LOCALE}
              hasError={form.from.hasError}
              value={fromDate}
              min={now}
              onOdsChange={(event) => {
                setValue('from', event.detail.formattedValue);
              }}
            ></OdsDatepicker>
          </OdsFormField>
          <OdsFormField className="w-1/2">
            <label htmlFor="until" slot="label">
              {t('common:until')} *
            </label>
            <OdsDatepicker
              name="until"
              id="until"
              data-testid="until"
              placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
              format="dd/mm/yyyy"
              locale={locale as ODS_DATEPICKER_LOCALE}
              hasError={form.from.hasError}
              value={untilDate}
              min={fromDate || now}
              onOdsChange={(event) =>
                setValue('until', event.detail.formattedValue)
              }
            ></OdsDatepicker>
          </OdsFormField>
        </div>
      )}
      <OdsFormField>
        <div className="flex leading-none gap-4">
          <OdsCheckbox
            id="sendCopy"
            inputId="sendCopy"
            name="sendCopy"
            data-testid="sendCopy"
            isChecked={form.sendCopy.value === 'checked'}
            onClick={() =>
              setValue(
                'sendCopy',
                form.sendCopy.value === 'checked' ? '' : 'checked',
              )
            }
          ></OdsCheckbox>
          <label htmlFor="sendCopy">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_auto_replies_add_send_copy_label')}
            </OdsText>
          </label>
        </div>
      </OdsFormField>
      {!!form.sendCopy.value && !isOrgAccountsLoading && (
        <OdsFormField>
          <OdsSelect
            id="sendCopyTo"
            name="sendCopyTo"
            data-testid="select-send-copy-to"
            placeholder={t('zimbra_auto_replies_add_select_send_copy_to')}
            value={form.sendCopyTo.value}
            hasError={form.sendCopyTo.hasError}
            className="w-1/2"
            isDisabled={
              !orgAccounts || orgAccounts?.length === 0 || isOrgAccountsLoading
                ? true
                : null
            }
            onOdsChange={(event) => setValue('sendCopyTo', event.detail.value)}
          >
            {(orgAccounts || []).map(({ currentState: acc }, index) => (
              <option key={`copy-${acc.email}-${index}`} value={acc.email}>
                {acc.email}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
      )}
      <OdsFormField>
        <label htmlFor="message" slot="label">
          {t('zimbra_auto_replies_add_message_label')} *
        </label>
        <OdsTextarea
          id="message"
          name="message"
          data-testid="message"
          value={form.message.value}
          defaultValue={form.message.defaultValue}
          placeholder={t('zimbra_auto_replies_add_message_placeholder')}
          hasError={form.message.hasError}
          onOdsChange={(event) => setValue('message', event.target.value)}
        ></OdsTextarea>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('zimbra_auto_replies_add_message_helper')}
        </OdsText>
      </OdsFormField>
      <div className="flex space-x-5">
        <OdsButton
          slot="actions"
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.default}
          isDisabled={!isFormValid}
          isLoading={isSending}
          onClick={handleSavelick}
          data-testid="confirm-btn"
          label={t('common:confirm')}
        ></OdsButton>
        <OdsButton
          slot="actions"
          onClick={handleCancelClick}
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('common:cancel')}
        ></OdsButton>
      </div>
    </div>
  );
}
