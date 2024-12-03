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
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  useAccount,
  useAccountList,
  useDomains,
  useGenerateUrl,
} from '@/hooks';
import {
  ACCOUNT_REGEX,
  checkValidityField,
  checkValidityForm,
  FormTypeInterface,
  makeDateFromDDMMYYYY,
} from '@/utils';
import Loading from '@/components/Loading/Loading';

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
  const { t } = useTranslation('autoReplies/add');
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const context = useContext(ShellContext);
  const locale = context.environment.getUserLocale();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const organizationId = searchParams.get('organizationId');
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(
    organizationId,
  );

  const goBackUrl = useGenerateUrl('..', 'path', params);

  const goBack = () => navigate(goBackUrl);

  const [form, setForm] = useState<FormTypeInterface>({
    ...{
      account: {
        value: '',
        defaultValue: '',
        touched: false,
        required: true,
        validate: ACCOUNT_REGEX,
      },
      domain: {
        value: '',
        touched: false,
        required: true,
      },
      duration: {
        value: AutoReplyDurations.TEMPORARY,
        touched: false,
        required: true,
      },
      from: {
        value: '',
        touched: false,
        required: true,
      },
      until: {
        value: '',
        touched: false,
        required: true,
      },
      sendCopy: {
        value: '',
        touched: false,
        required: false,
      },
      sendCopyTo: {
        value: '',
        touched: false,
        required: false,
      },
      message: {
        value: '',
        defaultValue: '',
        touched: false,
        required: true,
      },
    },
  });

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
  });

  const selectedDomain = useMemo(() => {
    return domains?.find(
      (domain) => form.domain.value === domain.currentState?.name,
    );
  }, [domains, form.domain.value]);

  const { data: domainAccounts } = useAccountList({
    enabled: !editEmailAccountId && !!selectedDomain,
    domainId: selectedDomain?.id,
  });

  const { data: orgAccounts, isLoading: isOrgAccountsLoading } = useAccountList(
    {
      enabled: !!form.sendCopy.value && !!selectedOrganizationId,
      organizationId: selectedOrganizationId,
    },
  );

  const { data: account, isLoading: isLoadingAccount } = useAccount({
    accountId: editEmailAccountId,
    enabled: !!editEmailAccountId,
  });

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      ...form[name],
      value,
      touched: true,
      hasError: !checkValidityField(name, value, form),
    };
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
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm(form));
  };

  useEffect(() => {
    if (account) {
      const [head, tail] = (account.currentState?.email || '@').split('@');
      handleFormChange('account', head);
      handleFormChange('domain', tail);
      setSelectedOrganizationId(account.currentState?.organizationId);
    }
  }, [account]);

  useEffect(() => {
    const orgId = selectedDomain?.currentState?.organizationId;
    if (selectedDomain && selectedOrganizationId !== orgId) {
      setSelectedOrganizationId(orgId);
    }
  }, [selectedDomain]);

  const { mutate: addAutoReply, isPending: isSending } = useMutation({
    mutationFn: (payload: Record<string, string>) => {
      // call api
      return Promise.resolve(payload);
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_auto_replies_add_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
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
      goBack();
    },
  });

  const handleSavelick = () => {
    addAutoReply(getDataBody(form));
  };

  return (
    <div className="w-full md:w-3/4 flex flex-col space-y-5">
      <Links
        type={LinkType.back}
        onClickReturn={goBack}
        iconAlignment={IconLinkAlignmentType.left}
        label={t('zimbra_auto_replies_add_cta_back')}
      />
      <Subtitle>{t('zimbra_auto_replies_add_title')}</Subtitle>
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
        {t('zimbra_auto_replies_mandatory_fields')}
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
                handleFormChange(
                  event.target.name,
                  event.target.value.toString(),
                )
              }
              onOdsChange={(event) => {
                handleFormChange(
                  event.detail.name,
                  event.detail.value.toString(),
                );
              }}
            >
              {domainAccounts && (
                <datalist slot="list">
                  {domainAccounts.map((acc) => {
                    const [head] = (acc.currentState?.email || '@').split('@');
                    return <option key={head} value={head}></option>;
                  })}
                </datalist>
              )}
            </OdsInput>
            <OdsInput
              name="@"
              type={ODS_INPUT_TYPE.text}
              value={'@'}
              isReadonly={true}
              isDisabled={true}
              className="w-10"
            ></OdsInput>
            <OdsSelect
              id="domain"
              name="domain"
              value={form.domain.value}
              className="w-1/2"
              hasError={form.from.hasError}
              isDisabled={isLoading || editEmailAccountId ? true : null}
              onOdsChange={(event) =>
                handleFormChange('domain', event.detail.value as string)
              }
              data-testid="select-domain"
              placeholder={t(
                'zimbra_auto_replies_add_select_domain_placeholder',
              )}
            >
              {domains?.map(({ currentState: domain }) => (
                <option key={domain.name} value={domain.name}>
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
              onOdsChange={(event) =>
                handleFormChange('duration', event.detail.value)
              }
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
              {t('zimbra_auto_replies_add_from_label')} *
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
                handleFormChange('from', event.detail.formattedValue);
              }}
            ></OdsDatepicker>
          </OdsFormField>
          <OdsFormField className="w-1/2">
            <label htmlFor="until" slot="label">
              {t('zimbra_auto_replies_add_until_label')} *
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
                handleFormChange('until', event.detail.formattedValue)
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
              handleFormChange(
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
      {!!form.sendCopy.value && (
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
            onOdsChange={(event) =>
              handleFormChange('sendCopyTo', event.detail.value)
            }
          >
            {orgAccounts?.map(({ currentState: acc }) => (
              <option key={acc.email} value={acc.email}>
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
          onOdsChange={(event) =>
            handleFormChange('message', event.target.value)
          }
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
          label={t('zimbra_auto_replies_add_button_confirm')}
        ></OdsButton>
        <OdsButton
          slot="actions"
          onClick={goBack}
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('zimbra_auto_replies_add_button_cancel')}
        ></OdsButton>
      </div>
    </div>
  );
}
