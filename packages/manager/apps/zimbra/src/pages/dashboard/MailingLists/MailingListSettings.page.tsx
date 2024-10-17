import React, { useCallback, useEffect, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsRadio,
  OdsSelect,
  OdsText,
  OdsToggle,
  OdsIcon,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { useGenerateUrl, usePlatform } from '@/hooks';
import {
  postZimbraPlatformMailingList,
  putZimbraPlatformMailingList,
  MailingListType,
  MailingListBodyParamsType,
  ReplyToChoices,
  ModerationChoices,
  getZimbraPlatformMailingListsQueryKey,
} from '@/api/mailinglist';
import { DomainType } from '@/api/domain';
import { formInputRegex } from './mailingList.constants';
import {
  checkValidityField,
  checkValidityForm,
  FormTypeInterface,
} from '@/utils';
import queryClient from '@/queryClient';

const replyToChoices = [
  {
    value: ReplyToChoices.LIST,
    key: 'zimbra_mailinglist_add_reply_to_list',
  },
  {
    value: ReplyToChoices.SENDER,
    key: 'zimbra_mailinglist_add_reply_to_sender',
  },
  {
    value: ReplyToChoices.MAILBOX,
    key: 'zimbra_mailinglist_add_reply_to_another_mailbox',
  },
];

const moderationChoices = [
  {
    value: ModerationChoices.ALL,
    key: 'zimbra_mailinglist_add_moderation_choice_all',
  },
  {
    value: ModerationChoices.SUBSONLY,
    key: 'zimbra_mailinglist_add_moderation_choice_subs_only',
  },
  {
    value: ModerationChoices.NONE,
    key: 'zimbra_mailinglist_add_moderation_choice_none',
  },
];

// fetch this from api ?
const languageList = ['FR', 'EN', 'ES'];

export default function MailingListSettings({
  domainList = [],
  editMailingListDetail = null,
}: Readonly<{
  domainList: DomainType[];
  editMailingListDetail: MailingListType;
}>) {
  const { t } = useTranslation('mailinglists/addAndEdit');
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editMailingListId = searchParams.get('editMailingListId');
  const organizationIdParam = searchParams.get('organizationId');
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedDomainOrganization, setSelectedDomainOrganization] = useState(
    '',
  );
  const goBackUrl = useGenerateUrl('..', 'path');

  const goBack = () => {
    return navigate(goBackUrl);
  };

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
      defaultReplyTo: {
        value: '',
        touched: false,
        required: true,
      },
      owner: {
        value: '',
        touched: false,
        required: true,
      },
      language: {
        value: '',
        touched: false,
        required: true,
      },
      moderationOption: {
        value: '',
        touched: false,
        required: false,
      },
      subscriberModeration: {
        value: '',
        touched: false,
        required: false,
      },
    },
  });

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

  useEffect(() => {
    if (editMailingListDetail) {
      const newForm: FormTypeInterface = form;
      const {
        email,
        defaultReplyTo,
        language,
        owner,
        moderationOption,
      } = editMailingListDetail.currentState;
      const [account, domain] = email.split('@');
      newForm.account.value = account;
      newForm.domain.value = domain;
      newForm.defaultReplyTo.value = defaultReplyTo;
      newForm.owner.value = owner;
      newForm.language.value = language;
      newForm.moderationOption.value = moderationOption;
      setForm((oldForm) => ({ ...oldForm, ...newForm }));
    }
  }, []);

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      ...form[name],
      value,
      touched: true,
      hasError: !checkValidityField(name, value, formInputRegex, form),
    };
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm(form));
  };

  const handleDomainChange = (selectedDomain: string) => {
    const organizationLabel = domainList.find(
      ({ currentState }) => currentState.name === selectedDomain,
    )?.currentState.organizationLabel;
    handleFormChange('domain', selectedDomain);
    setSelectedDomainOrganization(organizationLabel);
  };

  const { mutate: addOrEditMailingList, isPending: isSending } = useMutation({
    mutationFn: (params: MailingListBodyParamsType) => {
      return editMailingListId
        ? putZimbraPlatformMailingList(platformId, editMailingListId, params)
        : postZimbraPlatformMailingList(platformId, params);
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editMailingListId
              ? 'zimbra_mailinglist_edit_success_message'
              : 'zimbra_mailinglist_add_success_message',
          )}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editMailingListId
              ? 'zimbra_mailinglist_edit_error_message'
              : 'zimbra_mailinglist_add_error_message',
            {
              error: error.response?.data?.message,
            },
          )}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformMailingListsQueryKey(platformId),
      });
      goBack();
    },
  });

  const handleSavelick = () => {
    addOrEditMailingList(getDataBody(form));
  };

  return (
    <div className="w-full md:w-3/4 flex flex-col space-y-5">
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {!editMailingListId
          ? t('zimbra_mailinglist_add_header')
          : t('zimbra_mailinglist_edit_header')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('zimbra_mailinglist_mandatory_fields')}
      </OdsText>
      <OdsFormField>
        <label slot="label">
          {t('zimbra_mailinglist_add_input_email_label')} *
        </label>
        <div className="flex">
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="account"
            placeholder={t('zimbra_mailinglist_add_input_email_placeholder')}
            hasError={form.account.hasError}
            value={form.account.value}
            isRequired
            className="rounded-r-none w-1/2"
            data-testid="input-account"
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
          ></OdsInput>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name={'@'}
            value={'@'}
            isReadonly
            isDisabled
            className="w-10 rounded-none"
          ></OdsInput>
          <OdsSelect
            name="domain"
            value={form.domain.value}
            className="rounded-l-none w-1/2"
            hasError={form.domain.hasError}
            isRequired
            onOdsChange={(e) => handleDomainChange(e.detail.value)}
            data-testid="select-domain"
          >
            <span slot="placeholder">
              {t('zimbra_mailinglist_add_select_domain_placeholder')}
            </span>
            {domainList?.map(({ currentState: domain }) => (
              <option key={domain.name} value={domain.name}>
                {domain.name}
              </option>
            ))}
          </OdsSelect>
        </div>
      </OdsFormField>
      {selectedDomainOrganization && !organizationIdParam && (
        <OdsMessage color={ODS_MESSAGE_COLOR.information}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_mailinglist_add_message_organization', {
              organization: selectedDomainOrganization,
            })}
          </OdsText>
        </OdsMessage>
      )}
      <OdsFormField>
        <label slot="label">
          {t('zimbra_mailinglist_add_input_owner_label')} *
        </label>
        <div className="flex">
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="owner"
            placeholder={t('zimbra_mailinglist_add_input_owner_placeholder')}
            hasError={form.owner.hasError}
            value={form.owner.value}
            isRequired
            className="rounded-r-none w-1/2"
            data-testid="input-owner"
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
          ></OdsInput>
        </div>
      </OdsFormField>
      <OdsFormField>
        <label slot="label">
          {t('zimbra_mailinglist_add_reply_to_label')} *
        </label>
        <div className="flex">
          {replyToChoices.map(({ value, key }) => (
            <OdsRadio
              className="space-y-5"
              key={value}
              name="replyTo"
              value={form.defaultReplyTo.value}
              isChecked={form.defaultReplyTo.value === value}
              onOdsChange={(event) =>
                handleFormChange('defaultReplyTo', event.detail.value)
              }
              data-testid="radio-replyTo"
            >
              <div slot="end" className="flex flex-col">
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(key)}</OdsText>
              </div>
            </OdsRadio>
          ))}
        </div>
      </OdsFormField>

      <OdsFormField>
        <label slot="label">
          {t('zimbra_mailinglist_add_language_label')} *
        </label>
        <div className="flex">
          <OdsSelect
            name="language"
            value={form.language.value}
            className="rounded-l-none w-1/2"
            hasError={form.language.hasError}
            isRequired
            data-testid="select-language"
            onOdsChange={(e) => handleFormChange(e.detail.name, e.detail.value)}
          >
            <span slot="placeholder">
              {t('zimbra_mailinglist_add_select_language_placeholder')}
            </span>
            {languageList?.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </OdsSelect>
        </div>
      </OdsFormField>
      <OdsFormField>
        <label slot="label">
          {t('zimbra_mailinglist_add_moderation_choice_label')}
        </label>
        <div>
          {moderationChoices.map(({ value, key }) => (
            <OdsRadio
              key={value}
              name="moderationOption"
              value={value}
              onOdsChange={(event) =>
                handleFormChange('moderationOption', event.detail.value)
              }
              data-testid="radio-group-moderation-option"
            >
              <div slot="end" className="flex flex-col">
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(key)}</OdsText>
              </div>
            </OdsRadio>
          ))}
          <OdsToggle
            className="mt-4"
            data-testid="toggle-subscriber-moderation"
            onClick={() =>
              handleFormChange(
                'subscriberModeration',
                form.subscriberModeration.value === 'true' ? 'false' : 'true',
              )
            }
            {...(form.subscriberModeration.value === 'true'
              ? { isChecked: true }
              : {})}
            name="toggle-subscriber-moderation"
          >
            <div slot="end" className="flex flex-col ml-4">
              <OdsText preset={ODS_TEXT_PRESET.paragraph} className="flex">
                {t('zimbra_mailinglist_add_subscriber_moderation')}
                <OdsTooltip
                  className="ml-4 flex items-center"
                  triggerId="tooltip-trigger"
                >
                  <OdsIcon name={ODS_ICON_NAME.circleInfo} />
                  <div id="tooltip-trigger">
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      {t(
                        'zimbra_mailinglist_add_subscriber_moderation_tooltip',
                      )}
                    </OdsText>
                  </div>
                </OdsTooltip>
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_mailinglist_add_subscriber_moderation_info', {
                  max: 250,
                })}
              </OdsText>
            </div>
          </OdsToggle>
        </div>
      </OdsFormField>
      <div className="flex space-x-5">
        <OdsButton
          slot="actions"
          inline-block
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.default}
          {...(!isFormValid || isSending ? { disabled: true } : {})}
          onClick={handleSavelick}
          data-testid="confirm-btn"
          label={t('zimbra_mailinglist_add_button_confirm')}
        />
        {editMailingListId && (
          <OdsButton
            slot="actions"
            inline-block
            onClick={goBack}
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('zimbra_mailinglist_add_button_cancel')}
          />
        )}
      </div>
    </div>
  );
}
