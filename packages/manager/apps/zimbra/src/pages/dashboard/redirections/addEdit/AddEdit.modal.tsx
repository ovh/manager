import React, { useEffect, useMemo, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  MODAL_COLOR,
  SPINNER_SIZE,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { Loading } from '@/components';
import {
  RedirectionBodyParamsType,
  getZimbraPlatformRedirectionsQueryKey,
  postZimbraPlatformRedirection,
} from '@/data/api';
import { useAccount, useDomains } from '@/data/hooks';
import { useGenerateUrl, useOdsModalOverflowHack } from '@/hooks';
import queryClient from '@/queryClient';
import {
  ADD_REDIRECTION,
  CANCEL,
  CONFIRM,
  EDIT_REDIRECTION,
  EMAIL_ACCOUNT_ADD_REDIRECTION,
  EMAIL_ACCOUNT_EDIT_REDIRECTION,
} from '@/tracking.constants';
import { RedirectionSchema, redirectionSchema } from '@/utils';

export const AddEditOrganizationModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['redirections', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const { platformId, accountId, redirectionId } = useParams();

  const trackingName = useMemo(() => {
    if (accountId) {
      return redirectionId ? EMAIL_ACCOUNT_EDIT_REDIRECTION : EMAIL_ACCOUNT_ADD_REDIRECTION;
    }
    return redirectionId ? EDIT_REDIRECTION : ADD_REDIRECTION;
  }, [redirectionId, accountId]);

  const goBackUrl = useGenerateUrl(redirectionId ? '../..' : '..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { addError, addSuccess } = useNotifications();

  // @TODO refactor when ods modal overflow is fixed
  const modalRef = useRef<HTMLDivElement>(undefined);
  useOdsModalOverflowHack(modalRef as any);

  const { data: domains, isLoading: isLoadingDomains } = useDomains({
    enabled: !accountId && !redirectionId,
    shouldFetchAll: true,
  });

  const { data: accountDetail, isLoading: isLoadingAccount } = useAccount({
    accountId,
    enabled: !!accountId,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      account: '',
      domain: '',
      to: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(redirectionSchema),
  });

  useEffect(() => {
    if (accountDetail) {
      const [account, domain] = (accountDetail?.currentState?.email || '@').split('@');
      reset({
        account,
        domain,
        to: '',
      });
    }
  }, [accountDetail]);

  const { mutate: addRedirection, isPending: isSending } = useMutation({
    mutationFn: (payload: RedirectionBodyParamsType) => {
      return postZimbraPlatformRedirection(platformId, payload);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('zimbra_redirections_add_success_message')}</Text>,
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
          {t('zimbra_redirections_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformRedirectionsQueryKey(platformId),
      });

      onClose();
    },
  });

  const handleConfirmClick: SubmitHandler<RedirectionSchema> = (data) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });

    addRedirection({
      source: `${data.account}@${data.domain}`,
      destination: data.to,
    });
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
    <Modal
      type={MODAL_COLOR.information}
      ref={modalRef}
      open
      heading={t(redirectionId ? 'common:edit_redirection' : 'common:add_redirection')}
      onOpenChange={onClose}
      loading={isLoadingAccount}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        testId: 'confirm-btn',
        onClick: handleSubmit(handleConfirmClick),
        disabled: !isDirty || !isValid,
        loading: isLoadingDomains || isLoadingAccount || isSending,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
        testId: 'cancel-btn',
      }}
    >
      <form
        data-testid="redirection-form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <Text preset={TEXT_PRESET.paragraph}>{t('zimbra_redirections_add_header')}</Text>
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
                {t('zimbra_redirections_add_form_input_from')} *
              </FormFieldLabel>
              {accountId || redirectionId ? (
                <Input
                  type={INPUT_TYPE.email}
                  data-testid="input-from"
                  id={name}
                  name={name}
                  value={accountDetail?.currentState?.email}
                  disabled
                  readOnly
                />
              ) : (
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
                  ></Input>
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
                      <>
                        <Select
                          items={domains?.map((domain) => ({
                            label: domain?.currentState.name,
                            value: domain?.currentState.name,
                          }))}
                          id={field.name}
                          name={field.name}
                          invalid={(isDirty || isTouched) && !!errors[field.name]}
                          value={[field.value]}
                          className="w-1/2"
                          onValueChange={(detail) => field.onChange(detail.value[0])}
                          onBlur={field.onBlur}
                          disabled={isLoadingDomains}
                          data-testid="select-domain"
                        >
                          <SelectControl placeholder={t('common:select_domain')} />
                          <SelectContent createPortal={false} />
                        </Select>
                        {isLoadingDomains && (
                          <Loading className="flex justify-center" size={SPINNER_SIZE.sm} />
                        )}
                      </>
                    )}
                  />
                </div>
              )}
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="to"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              data-testid="field-to"
              className="w-full"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
            >
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_redirections_add_form_input_to')} *
              </FormFieldLabel>
              <Input
                data-testid="input-to"
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
      </form>
    </Modal>
  );
};

export default AddEditOrganizationModal;
