import React, { useCallback, useEffect, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsMessage,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
  OsdsToggle,
  OsdsTooltipContent,
  OsdsIcon,
  OsdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
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
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t(
            editMailingListId
              ? 'zimbra_mailinglist_edit_success_message'
              : 'zimbra_mailinglist_add_success_message',
          )}
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
          {t(
            editMailingListId
              ? 'zimbra_mailinglist_edit_error_message'
              : 'zimbra_mailinglist_add_error_message',
            {
              error: error.response?.data?.message,
            },
          )}
        </OsdsText>,
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
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      >
        {!editMailingListId
          ? t('zimbra_mailinglist_add_header')
          : t('zimbra_mailinglist_edit_header')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      >
        {t('zimbra_mailinglist_mandatory_fields')}
      </OsdsText>
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_mailinglist_add_input_email_label')} *
          </OsdsText>
        </div>
        <div className="flex">
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            name="account"
            placeholder={t('zimbra_mailinglist_add_input_email_placeholder')}
            color={
              form.account.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            size={ODS_INPUT_SIZE.md}
            value={form.account.value}
            required
            className="rounded-r-none w-1/2"
            data-testid="input-account"
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
          ></OsdsInput>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            color={ODS_THEME_COLOR_INTENT.default}
            size={ODS_INPUT_SIZE.md}
            value={'@'}
            readOnly={true}
            disabled={true}
            className="w-10 rounded-none"
          ></OsdsInput>
          <OsdsSelect
            name="domain"
            value={form.domain.value}
            className="rounded-l-none w-1/2"
            color={
              form.domain.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            required
            onOdsValueChange={(e) =>
              handleDomainChange(e.detail.value as string)
            }
            data-testid="select-domain"
          >
            <span slot="placeholder">
              {t('zimbra_mailinglist_add_select_domain_placeholder')}
            </span>
            {domainList?.map(({ currentState: domain }) => (
              <OsdsSelectOption key={domain.name} value={domain.name}>
                {domain.name}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
      </OsdsFormField>
      {selectedDomainOrganization && !organizationIdParam && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_MESSAGE_TYPE.info}
        >
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            {t('zimbra_mailinglist_add_message_organization', {
              organization: selectedDomainOrganization,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_mailinglist_add_input_owner_label')} *
          </OsdsText>
        </div>
        <div className="flex">
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            name="owner"
            placeholder={t('zimbra_mailinglist_add_input_owner_placeholder')}
            color={
              form.owner.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            size={ODS_INPUT_SIZE.md}
            value={form.owner.value}
            required
            className="rounded-r-none w-1/2"
            data-testid="input-owner"
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
          ></OsdsInput>
        </div>
      </OsdsFormField>
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_mailinglist_add_reply_to_label')} *
          </OsdsText>
        </div>
        <div className="flex">
          <OsdsRadioGroup
            value={form.defaultReplyTo.value}
            data-testid="radio-group-reply-to"
            onOdsValueChange={(event) =>
              handleFormChange('defaultReplyTo', event.detail.newValue)
            }
          >
            {replyToChoices.map(({ value, key }) => (
              <OsdsRadio key={value} value={value}>
                <OsdsRadioButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_RADIO_BUTTON_SIZE.sm}
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
        </div>
      </OsdsFormField>
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_mailinglist_add_language_label')} *
          </OsdsText>
        </div>
        <div className="flex">
          <OsdsSelect
            name="language"
            value={form.language.value}
            className="rounded-l-none w-1/2"
            color={
              form.language.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            required
            data-testid="select-language"
            onOdsValueChange={(e) =>
              handleFormChange(e.detail.name, e.detail.value as string)
            }
          >
            <span slot="placeholder">
              {t('zimbra_mailinglist_add_select_language_placeholder')}
            </span>
            {languageList?.map((lang) => (
              <OsdsSelectOption key={lang} value={lang}>
                {lang}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
      </OsdsFormField>
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_mailinglist_add_moderation_choice_label')}
          </OsdsText>
        </div>
        <div>
          <OsdsRadioGroup
            value={form.moderationOption.value}
            data-testid="radio-group-moderation-option"
            onOdsValueChange={(event) =>
              handleFormChange('moderationOption', event.detail.newValue)
            }
          >
            {moderationChoices.map(({ value, key }) => (
              <OsdsRadio key={value} value={value}>
                <OsdsRadioButton
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_RADIO_BUTTON_SIZE.sm}
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
          <OsdsToggle
            className="mt-4"
            data-testid="toggle-subscriber-moderation"
            onClick={() =>
              handleFormChange(
                'subscriberModeration',
                form.subscriberModeration.value === 'true' ? 'false' : 'true',
              )
            }
            {...(form.subscriberModeration.value === 'true'
              ? { checked: true }
              : {})}
          >
            <div slot="end" className="flex flex-col ml-4">
              <OsdsText
                className="flex"
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('zimbra_mailinglist_add_subscriber_moderation')}
                <OsdsTooltip className="ml-4 flex items-center">
                  <OsdsIcon
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_ICON_SIZE.xxs}
                    name={ODS_ICON_NAME.HELP_CIRCLE}
                  />
                  <OsdsTooltipContent slot="tooltip-content">
                    <OsdsText
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                    >
                      {t(
                        'zimbra_mailinglist_add_subscriber_moderation_tooltip',
                      )}
                    </OsdsText>
                  </OsdsTooltipContent>
                </OsdsTooltip>
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._100}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('zimbra_mailinglist_add_subscriber_moderation_info', {
                  max: 250,
                })}
              </OsdsText>
            </div>
          </OsdsToggle>
        </div>
      </OsdsFormField>
      <div className="flex space-x-5">
        <OsdsButton
          slot="actions"
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          {...(!isFormValid || isSending ? { disabled: true } : {})}
          onClick={handleSavelick}
          data-testid="confirm-btn"
        >
          {t('zimbra_mailinglist_add_button_confirm')}
        </OsdsButton>
        {editMailingListId && (
          <OsdsButton
            slot="actions"
            inline
            onClick={goBack}
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
          >
            {t('zimbra_mailinglist_add_button_cancel')}
          </OsdsButton>
        )}
      </div>
    </div>
  );
}
