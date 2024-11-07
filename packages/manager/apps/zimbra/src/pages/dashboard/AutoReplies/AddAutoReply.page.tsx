import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Links,
  LinkType,
  Subtitle,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
  OsdsTextarea,
  OsdsDatepicker,
  OsdsCheckboxButton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  ODS_LOCALE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
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
        touched: false,
        required: true,
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
      hasError: !checkValidityField(
        name,
        value,
        { account: ACCOUNT_REGEX },
        form,
      ),
    };
    if (name === 'sendCopy') {
      newForm.sendCopyTo.required = !!newForm.sendCopy.value;
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
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_auto_replies_add_success_message')}
        </OsdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_auto_replies_add_error_message', {
            error: error.response?.data?.message,
          })}
        </OsdsText>,
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
        label={t('zimbra_auto_replies_add_cta_back')}
      />
      <Subtitle>{t('zimbra_auto_replies_add_title')}</Subtitle>
      {editEmailAccountId && account && !isLoadingAccount && (
        <OsdsText
          data-testid="create-for-account"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          {t('zimbra_auto_replies_add_header_create_for_account')}
          <b> {account.currentState?.email}</b>
        </OsdsText>
      )}
      <OsdsText
        data-testid="page-header"
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      >
        {t('zimbra_auto_replies_add_header')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      >
        {t('zimbra_auto_replies_mandatory_fields')}
      </OsdsText>
      {!editEmailAccountId && (
        <OsdsFormField>
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_auto_replies_add_account_label')} *
            </OsdsText>
          </div>
          <div className="flex">
            <OsdsInput
              type={ODS_INPUT_TYPE.text}
              id="account"
              name="account"
              color={
                form.account.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.default
              }
              size={ODS_INPUT_SIZE.md}
              value={form.account.value}
              required
              className="w-1/2"
              data-testid="input-account"
              disabled={editEmailAccountId ? true : null}
              onOdsInputBlur={({ target: { name, value } }) =>
                handleFormChange(name, value.toString())
              }
              onOdsValueChange={({ detail: { name, value } }) => {
                handleFormChange(name, value);
              }}
            >
              <datalist id="account">
                {domainAccounts?.map((acc) => {
                  const [head] = (acc.currentState?.email || '@').split('@');
                  return (
                    <option key={head} value={head}>
                      {head}
                    </option>
                  );
                })}
              </datalist>
            </OsdsInput>
            <OsdsInput
              type={ODS_INPUT_TYPE.text}
              color={ODS_THEME_COLOR_INTENT.default}
              size={ODS_INPUT_SIZE.md}
              value={'@'}
              readOnly={true}
              disabled={true}
              className="w-10"
            ></OsdsInput>
            <OsdsSelect
              name="domain"
              value={form.domain.value}
              className="w-1/2"
              required
              color={
                form.domain.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.default
              }
              disabled={isLoading || editEmailAccountId ? true : null}
              onOdsValueChange={(event) =>
                handleFormChange('domain', event.detail.value as string)
              }
              data-testid="select-domain"
            >
              <span slot="placeholder">
                {t('zimbra_auto_replies_add_select_domain_placeholder')}
              </span>
              {domains?.map(({ currentState: domain }) => (
                <OsdsSelectOption key={domain.name} value={domain.name}>
                  {domain.name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
            {isLoading && <Loading size={ODS_SPINNER_SIZE.sm} />}
          </div>
        </OsdsFormField>
      )}

      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_auto_replies_add_duration_label')} *
          </OsdsText>
        </div>
        <OsdsRadioGroup
          id="duration"
          name="duration"
          value={form.duration.value}
          defaultValue={form.duration.value}
          data-testid="radio-group-duration"
          onOdsValueChange={(event) =>
            handleFormChange('duration', event.detail.newValue)
          }
        >
          {durationChoices.map(({ value, key }) => (
            <OsdsRadio key={value} value={value}>
              <OsdsRadioButton
                data-testid={value}
                className="cursor-pointer"
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_RADIO_BUTTON_SIZE.xs}
              >
                <span slot="end">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_TEXT_SIZE._400}
                    level={ODS_TEXT_LEVEL.body}
                  >
                    {t(key)}
                  </OsdsText>
                </span>
              </OsdsRadioButton>
            </OsdsRadio>
          ))}
        </OsdsRadioGroup>
      </OsdsFormField>
      {form.duration.value === AutoReplyDurations.TEMPORARY && (
        <div className="flex gap-4">
          <OsdsFormField className="w-1/2">
            <div slot="label">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              >
                {t('zimbra_auto_replies_add_from_label')} *
              </OsdsText>
            </div>
            <OsdsDatepicker
              name="from"
              id="from"
              data-testid="from"
              placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
              format="dd/mm/yyyy"
              locale={locale as ODS_LOCALE}
              color={
                form.from.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              value={fromDate}
              minDate={now}
              onOdsDatepickerValueChange={(event) => {
                handleFormChange('from', event.detail.formattedValue);
              }}
            ></OsdsDatepicker>
          </OsdsFormField>
          <OsdsFormField className="w-1/2">
            <div slot="label">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              >
                {t('zimbra_auto_replies_add_until_label')} *
              </OsdsText>
            </div>
            <OsdsDatepicker
              name="until"
              id="until"
              data-testid="until"
              placeholder={t('zimbra_auto_replies_add_datepicker_placeholder')}
              format="dd/mm/yyyy"
              locale={locale as ODS_LOCALE}
              color={
                form.until.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              value={untilDate}
              minDate={fromDate || now}
              onOdsDatepickerValueChange={(event) =>
                handleFormChange('until', event.detail.formattedValue)
              }
            ></OsdsDatepicker>
          </OsdsFormField>
        </div>
      )}
      <OsdsFormField>
        <OsdsCheckboxButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_CHECKBOX_BUTTON_SIZE.sm}
          checked={form.sendCopy.value === 'checked'}
          data-testid="sendcopy"
          onClick={() =>
            handleFormChange(
              'sendCopy',
              form.sendCopy.value === 'checked' ? '' : 'checked',
            )
          }
        >
          <span slot="end">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            >
              {t('zimbra_auto_replies_add_send_copy_label')}
            </OsdsText>
          </span>
        </OsdsCheckboxButton>
      </OsdsFormField>
      {!!form.sendCopy.value && (
        <OsdsFormField>
          <OsdsSelect
            name="sendCopyTo"
            value={form.sendCopyTo.value}
            color={
              form.sendCopyTo.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            className="w-1/2"
            disabled={
              !orgAccounts || orgAccounts?.length === 0 || isOrgAccountsLoading
                ? true
                : null
            }
            onOdsValueChange={(event) =>
              handleFormChange('sendCopyTo', event.detail.value as string)
            }
            data-testid="select-send-copy-to"
          >
            <span slot="placeholder">
              {t('zimbra_auto_replies_add_select_send_copy_to')}
            </span>
            {orgAccounts?.map(({ currentState: acc }) => (
              <OsdsSelectOption key={acc.email} value={acc.email}>
                {acc.email}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      )}
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_auto_replies_add_message_label')} *
          </OsdsText>
        </div>
        <OsdsTextarea
          name="message"
          id="message"
          data-testid="message"
          value={form.message.value}
          placeholder={t('zimbra_auto_replies_add_message_placeholder')}
          onOdsValueChange={(event) =>
            handleFormChange('message', event.target.value)
          }
          color={
            form.message.hasError
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.default
          }
        ></OsdsTextarea>
        <div slot="helper">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_auto_replies_add_message_helper')}
          </OsdsText>
        </div>
      </OsdsFormField>
      <div className="flex space-x-5">
        <OsdsButton
          slot="actions"
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          disabled={!isFormValid || isSending ? true : null}
          onClick={handleSavelick}
          data-testid="confirm-btn"
        >
          {t('zimbra_auto_replies_add_button_confirm')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          inline
          onClick={goBack}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
        >
          {t('zimbra_auto_replies_add_button_cancel')}
        </OsdsButton>
      </div>
    </div>
  );
}
