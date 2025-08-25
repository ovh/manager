import React, { useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  OdsSelectChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsMessage,
  OdsRadio,
  OdsSelect,
  OdsText,
  OdsToggle,
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

import { Loading } from '@/components';
import {
  DomainType,
  MailingListBodyParamsType,
  ModerationChoices,
  ReplyToChoices,
  ResourceStatus,
  getZimbraPlatformMailingListsQueryKey,
  postZimbraPlatformMailingList,
  putZimbraPlatformMailingList,
} from '@/data/api';
import { useDomains, useMailingList } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { ADD_MAILING_LIST, CONFIRM, EDIT_MAILING_LIST } from '@/tracking.constants';
import { MailingListSchema, mailingListSchema } from '@/utils';

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
export const languages = ['FR', 'EN', 'ES'] as const;

export const MailingListForm = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation([
    'mailing-lists/form',
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { platformId, mailingListId } = useParams();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  const trackingName = mailingListId ? EDIT_MAILING_LIST : ADD_MAILING_LIST;
  const [selectedDomainOrganization, setSelectedDomainOrganization] = useState('');
  const goBackUrl = useGenerateUrl('..', 'path');

  const goBack = () => navigate(goBackUrl);

  const { data: mailingList } = useMailingList({ mailingListId });

  const { data: domains, isLoading: isLoadingDomains } = useDomains({
    shouldFetchAll: true,
  });
  //
  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackDomains, setHackDomains] = useState<DomainType[]>([]);
  const [hackKeyDomains, setHackKeyDomains] = useState(Date.now());

  useEffect(() => {
    setHackDomains(
      (domains || []).filter((domain) => domain.resourceStatus === ResourceStatus.READY),
    );
    setHackKeyDomains(Date.now());
  }, [domains]);

  const setSelectedOrganization = (e: OdsSelectChangeEvent) => {
    const organizationLabel = domains?.find(
      ({ currentState }) => currentState.name === e?.detail?.value,
    )?.currentState.organizationLabel;
    setSelectedDomainOrganization(organizationLabel);
  };

  const { mutate: addOrEditMailingList, isPending: isSending } = useMutation({
    mutationFn: (params: MailingListBodyParamsType) => {
      return mailingListId
        ? putZimbraPlatformMailingList(platformId, mailingListId, params)
        : postZimbraPlatformMailingList(platformId, params);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            mailingListId
              ? 'zimbra_mailinglist_edit_success_message'
              : 'zimbra_mailinglist_add_success_message',
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
            mailingListId
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
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getZimbraPlatformMailingListsQueryKey(platformId),
      });
      goBack();
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
    reset,
  } = useForm({
    defaultValues: {
      account: mailingList?.currentState?.email?.split('@')[0] || '',
      domain: mailingList?.currentState?.email?.split('@')[1] || '',
      defaultReplyTo: mailingList?.currentState?.defaultReplyTo || '',
      owner: mailingList?.currentState?.owner || '',
      language: mailingList?.currentState?.language || '',
      moderationOption: mailingList?.currentState?.moderationOption || '',
      subscriberModeration: mailingList?.currentState?.subscriberModeration || false,
    },
    mode: 'onTouched',
    resolver: zodResolver(mailingListSchema),
  });

  useEffect(() => {
    if (mailingList) {
      reset({
        account: mailingList?.currentState?.email?.split('@')[0],
        domain: mailingList?.currentState?.email?.split('@')[1],
        defaultReplyTo: mailingList?.currentState?.defaultReplyTo,
        owner: mailingList?.currentState?.owner,
        language: mailingList?.currentState?.language,
        moderationOption: mailingList?.currentState?.moderationOption,
        subscriberModeration: mailingList?.currentState?.subscriberModeration,
      });
    }
  }, [mailingList]);

  const handleSavelick: SubmitHandler<MailingListSchema> = (data) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });

    const { account, domain } = data;

    const payload: Record<string, unknown> = {
      email: `${account}@${domain}`,
    };

    Object.entries(data).forEach(([key, value]) => {
      if (!['account', 'domain'].includes(key)) {
        payload[key] = value;
      }
    });

    addOrEditMailingList(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSavelick)}
      className="w-full md:w-3/4 flex flex-col space-y-5"
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {!mailingListId ? t('zimbra_mailinglist_add_header') : t('zimbra_mailinglist_edit_header')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</OdsText>
      <Controller
        control={control}
        name="account"
        render={({ field: { name, value, onChange, onBlur } }) => (
          <OdsFormField className="w-full" error={errors?.[name]?.message}>
            <label htmlFor={name} slot="label">
              {t('zimbra_mailinglist_add_input_email_label')} *
            </label>
            <div className="flex">
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                placeholder={t('zimbra_mailinglist_add_input_email_placeholder')}
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
                      isDisabled={isLoadingDomains || !domains}
                      placeholder={t('common:select_domain')}
                      onOdsChange={(e) => {
                        field.onChange(e);
                        setSelectedOrganization(e);
                      }}
                      onOdsBlur={field.onBlur}
                      data-testid="select-domain"
                      className="w-full"
                    >
                      {hackDomains?.map(({ currentState: domain }) => (
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
      {selectedDomainOrganization && !organizationId && (
        <OdsMessage color={ODS_MESSAGE_COLOR.information} isDismissible={false}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_mailinglist_add_message_organization', {
              organization: selectedDomainOrganization,
            })}
          </OdsText>
        </OdsMessage>
      )}
      <Controller
        control={control}
        name="owner"
        render={({ field: { name, value, onChange, onBlur } }) => (
          <OdsFormField error={errors?.[name]?.message}>
            <label htmlFor={name} slot="label">
              {t('common:owner')} *
            </label>
            <OdsInput
              placeholder={t('common:owner')}
              className="w-1/2"
              data-testid="input-owner"
              type={ODS_INPUT_TYPE.text}
              id={name}
              name={name}
              hasError={!!errors[name]}
              value={value}
              onOdsBlur={onBlur}
              onOdsChange={onChange}
            />
          </OdsFormField>
        )}
      />
      <Controller
        control={control}
        name="defaultReplyTo"
        render={({ field: { name, value, onChange } }) => (
          <OdsFormField error={errors?.[name]?.message}>
            <label htmlFor={name} slot="label">
              {t('zimbra_mailinglist_add_reply_to_label')} *
            </label>
            <div className="flex flex-col gap-4">
              {replyToChoices.map((choice) => (
                <div key={choice.value} className="flex leading-none gap-4">
                  <OdsRadio
                    id={choice.value}
                    name={choice.value}
                    value={value}
                    isChecked={value === (choice.value as string)}
                    onClick={() => onChange(choice.value)}
                    data-testid={`radio-reply-to-${choice.value}`}
                  ></OdsRadio>
                  <label htmlFor={choice.value} className="flex flex-col cursor-pointer">
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(choice.key)}</OdsText>
                  </label>
                </div>
              ))}
            </div>
          </OdsFormField>
        )}
      />
      <Controller
        control={control}
        name="language"
        render={({ field: { name, value, onChange, onBlur } }) => (
          <OdsFormField error={errors?.[name]?.message}>
            <label htmlFor={name} slot="label">
              {t('zimbra_mailinglist_add_language_label')} *
            </label>
            <OdsSelect
              data-testid="select-language"
              placeholder={t('zimbra_mailinglist_add_select_language_placeholder')}
              className="w-1/2"
              id={name}
              name={name}
              value={value}
              hasError={!!errors[name]}
              onOdsChange={onChange}
              onOdsBlur={onBlur}
            >
              {languages?.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </OdsSelect>
          </OdsFormField>
        )}
      />
      <Controller
        control={control}
        name="moderationOption"
        render={({ field: { name, value, onChange } }) => (
          <OdsFormField error={errors?.[name]?.message}>
            <label htmlFor={name} slot="label">
              {t('zimbra_mailinglist_add_moderation_choice_label')} *
            </label>
            <div className="flex flex-col gap-4">
              {moderationChoices.map((choice) => (
                <div key={choice.value} className="flex leading-none gap-4">
                  <OdsRadio
                    id={choice.value}
                    name={choice.value}
                    value={value}
                    isChecked={value === (choice.value as string)}
                    onClick={() => onChange(choice.value)}
                    data-testid={`radio-moderation-option-${choice.value}`}
                  ></OdsRadio>
                  <label htmlFor={choice.value} className="flex flex-col cursor-pointer">
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(choice.key)}</OdsText>
                  </label>
                </div>
              ))}
              <Controller
                control={control}
                name="subscriberModeration"
                render={({ field }) => (
                  <div className="flex">
                    <OdsToggle
                      className="mt-4"
                      data-testid="toggle-subscriber-moderation"
                      onOdsChange={(e) => field.onChange(e.detail.value)}
                      withLabel
                      name={field.name}
                    ></OdsToggle>
                    <div className="flex flex-col ml-4 w-full">
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        {t('zimbra_mailinglist_add_subscriber_moderation')}
                        <OdsIcon
                          className="ml-3 text-xs"
                          id="subs-tooltip-trigger"
                          name={ODS_ICON_NAME.circleInfo}
                        />
                      </OdsText>
                      <OdsTooltip triggerId="subs-tooltip-trigger">
                        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                          {t('zimbra_mailinglist_add_subscriber_moderation_tooltip')}
                        </OdsText>
                      </OdsTooltip>
                      <OdsText preset={ODS_TEXT_PRESET.caption}>
                        {t('zimbra_mailinglist_add_subscriber_moderation_info', {
                          max: 250,
                        })}
                      </OdsText>
                    </div>
                  </div>
                )}
              />
            </div>
          </OdsFormField>
        )}
      />
      <OdsButton
        slot="actions"
        type="submit"
        variant={ODS_BUTTON_VARIANT.default}
        isDisabled={!isDirty || !isValid}
        isLoading={isSending}
        data-testid="confirm-btn"
        label={t(`${NAMESPACES.ACTIONS}:confirm`)}
      />
    </form>
  );
};

export default MailingListForm;
