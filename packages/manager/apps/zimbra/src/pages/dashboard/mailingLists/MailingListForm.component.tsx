import React, { useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
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
  Toggle,
  ToggleControl,
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

import { Loading } from '@/components';
import {
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

  const setSelectedOrganization = (value: string) => {
    const organizationLabel = domains?.find(({ currentState }) => currentState.name === value)
      ?.currentState.organizationLabel;
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
        <Text preset={TEXT_PRESET.paragraph}>
          {t(
            mailingListId
              ? 'zimbra_mailinglist_edit_success_message'
              : 'zimbra_mailinglist_add_success_message',
          )}
        </Text>,
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
          {t(
            mailingListId
              ? 'zimbra_mailinglist_edit_error_message'
              : 'zimbra_mailinglist_add_error_message',
            {
              error: error.response?.data?.message,
            },
          )}
        </Text>,
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
      className="flex w-full flex-col space-y-5 md:w-3/4"
    >
      <Text preset={TEXT_PRESET.paragraph}>
        {!mailingListId ? t('zimbra_mailinglist_add_header') : t('zimbra_mailinglist_edit_header')}
      </Text>
      <Text preset={TEXT_PRESET.caption}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</Text>
      <Controller
        control={control}
        name="account"
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <FormField className="w-full" invalid={(isDirty || isTouched) && !!errors?.[name]}>
            <FormFieldLabel htmlFor={name} slot="label">
              {t('zimbra_mailinglist_add_input_email_label')} *
            </FormFieldLabel>
            <div className="flex">
              <Input
                type={INPUT_TYPE.text}
                placeholder={t('zimbra_mailinglist_add_input_email_placeholder')}
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
                render={({ field }) => (
                  <div className="flex flex-1">
                    <Select
                      items={domains
                        ?.filter((domain) => domain.resourceStatus === ResourceStatus.READY)
                        .map((domain) => ({
                          label: domain?.currentState.name,
                          value: domain?.currentState.name,
                        }))}
                      id={name}
                      name={field.name}
                      invalid={(isDirty || isTouched) && !!errors[field.name]}
                      value={[field.value]}
                      disabled={isLoadingDomains || !domains}
                      onValueChange={({ value }) => {
                        field.onChange(value[0]);
                        setSelectedOrganization(value[0]);
                      }}
                      onBlur={field.onBlur}
                      data-testid="select-domain"
                      className="w-full"
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
      {selectedDomainOrganization && !organizationId && (
        <Message color={MESSAGE_COLOR.information} dismissible={false}>
          <MessageIcon name={ICON_NAME.circleInfo} />
          <MessageBody>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('zimbra_mailinglist_add_message_organization', {
                organization: selectedDomainOrganization,
              })}
            </Text>
          </MessageBody>
        </Message>
      )}
      <Controller
        control={control}
        name="owner"
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
            <FormFieldLabel htmlFor={name} slot="label">
              {t('common:owner')} *
            </FormFieldLabel>
            <Input
              placeholder={t('common:owner')}
              className="w-1/2"
              data-testid="input-owner"
              type={INPUT_TYPE.text}
              id={name}
              name={name}
              invalid={(isDirty || isTouched) && !!errors[name]}
              value={value}
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
        name="defaultReplyTo"
        render={({ field: { name, value, onChange }, fieldState: { isDirty, isTouched } }) => (
          <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
            <FormFieldLabel>{t('zimbra_mailinglist_add_reply_to_label')} *</FormFieldLabel>
            <RadioGroup value={value} onValueChange={onChange}>
              {replyToChoices.map((choice) => (
                <div key={choice.value} className="flex gap-4 leading-none">
                  <Radio
                    id={choice.value}
                    value={choice.value}
                    data-testid={`radio-reply-to-${choice.value}`}
                  >
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.paragraph}>{t(choice.key)}</Text>
                    </RadioLabel>
                  </Radio>
                </div>
              ))}
            </RadioGroup>
            {(isDirty || isTouched) && errors?.[name]?.message && (
              <FormFieldError>{errors[name].message}</FormFieldError>
            )}
          </FormField>
        )}
      />
      <Controller
        control={control}
        name="language"
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
            <FormFieldLabel htmlFor={name} slot="label">
              {t('zimbra_mailinglist_add_language_label')} *
            </FormFieldLabel>
            <Select
              data-testid="select-language"
              items={languages?.map((lang) => ({ label: lang, value: lang }))}
              className="w-1/2"
              id={name}
              name={name}
              value={[value]}
              invalid={(isDirty || isTouched) && !!errors[name]}
              onValueChange={(detail) => onChange(detail.value[0])}
              onBlur={onBlur}
            >
              <SelectControl
                placeholder={t('zimbra_mailinglist_add_select_language_placeholder')}
              />
              <SelectContent />
            </Select>
            {(isDirty || isTouched) && errors?.[name]?.message && (
              <FormFieldError>{errors[name].message}</FormFieldError>
            )}
          </FormField>
        )}
      />
      <Controller
        control={control}
        name="moderationOption"
        render={({ field: { name, value, onChange }, fieldState: { isDirty, isTouched } }) => (
          <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
            <FormFieldLabel htmlFor={name} slot="label">
              {t('zimbra_mailinglist_add_moderation_choice_label')} *
            </FormFieldLabel>
            <RadioGroup value={value} onValueChange={onChange}>
              {moderationChoices.map((choice) => (
                <Radio
                  id={choice.value}
                  key={value}
                  value={value}
                  data-testid={`radio-moderation-option-${choice.value}`}
                >
                  <RadioControl />
                  <RadioLabel>
                    <Text preset={TEXT_PRESET.paragraph}>{t(choice.key)}</Text>
                  </RadioLabel>
                </Radio>
              ))}
              <Controller
                control={control}
                name="subscriberModeration"
                render={({ field }) => (
                  <div className="flex">
                    <Toggle
                      className="mt-4"
                      data-testid="toggle-subscriber-moderation"
                      onCheckedChange={(detail) => field.onChange(detail.checked)}
                      name={field.name}
                    >
                      <ToggleControl />
                    </Toggle>
                    <div className="ml-4 flex w-full flex-col">
                      <Text preset={TEXT_PRESET.paragraph}>
                        {t('zimbra_mailinglist_add_subscriber_moderation')}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Icon className="ml-3 text-xs" name={ICON_NAME.circleInfo} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <Text preset={TEXT_PRESET.paragraph}>
                              {t('zimbra_mailinglist_add_subscriber_moderation_tooltip')}
                            </Text>
                          </TooltipContent>
                        </Tooltip>
                      </Text>

                      <Text preset={TEXT_PRESET.caption}>
                        {t('zimbra_mailinglist_add_subscriber_moderation_info', {
                          max: 250,
                        })}
                      </Text>
                    </div>
                  </div>
                )}
              />
            </RadioGroup>
            {(isDirty || isTouched) && errors?.[name]?.message && (
              <FormFieldError>{errors[name].message}</FormFieldError>
            )}
          </FormField>
        )}
      />
      <Button
        slot="actions"
        type="submit"
        variant={BUTTON_VARIANT.default}
        disabled={!isDirty || !isValid}
        loading={isSending}
        data-testid="confirm-btn"
      >
        {t(`${NAMESPACES.ACTIONS}:confirm`)}
      </Button>
    </form>
  );
};

export default MailingListForm;
