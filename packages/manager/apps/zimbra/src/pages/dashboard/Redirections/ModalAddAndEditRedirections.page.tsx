import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsCheckbox,
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/Modals/Modal';
import { useAccount, useDomains, useGenerateUrl } from '@/hooks';
import { RedirectionSchema, redirectionSchema } from '@/utils';
import {
  ADD_REDIRECTION,
  CANCEL,
  CONFIRM,
  EDIT_REDIRECTION,
  EMAIL_ACCOUNT_ADD_REDIRECTION,
  EMAIL_ACCOUNT_EDIT_REDIRECTION,
} from '@/tracking.constant';

export default function ModalAddAndEditRedirections() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('redirections');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const editRedirectionId = searchParams.get('editRedirectionId');
  const params = Object.fromEntries(searchParams.entries());
  delete params.editRedirectionId;

  const trackingName = useMemo(() => {
    if (editEmailAccountId) {
      return editRedirectionId
        ? EMAIL_ACCOUNT_EDIT_REDIRECTION
        : EMAIL_ACCOUNT_ADD_REDIRECTION;
    }
    return editRedirectionId ? EDIT_REDIRECTION : ADD_REDIRECTION;
  }, [editRedirectionId, editEmailAccountId]);

  const goBackUrl = useGenerateUrl('..', 'path', params);
  const onClose = () => navigate(goBackUrl);

  const { addError, addSuccess } = useNotifications();

  const { data: domains, isLoading: isLoadingDomain } = useDomains({
    enabled: !editEmailAccountId && !editRedirectionId,
    shouldFetchAll: true,
  });

  const { data: accountDetail, isLoading: isLoadingAccount } = useAccount({
    accountId: editEmailAccountId,
    enabled: !!editEmailAccountId,
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
      keepCopy: false,
    },
    mode: 'onTouched',
    resolver: zodResolver(redirectionSchema),
  });

  useEffect(() => {
    if (accountDetail) {
      const [account, domain] = (
        accountDetail?.currentState?.email || '@'
      ).split('@');
      reset({
        account,
        domain,
        to: '',
        keepCopy: false,
      });
    }
  }, [accountDetail]);

  const { mutate: addRedirection, isPending: isSending } = useMutation({
    mutationFn: (payload: RedirectionSchema) => {
      return Promise.resolve(payload);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_add_success_message')}
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
          {t('zimbra_redirections_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      /* queryClient.invalidateQueries({
        queryKey: getZimbraPlatformRedirectionsQueryKey(platformId),
      }); */

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

    addRedirection(data);
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
      isOpen
      color={ODS_MODAL_COLOR.information}
      isDismissible
      title={t(
        editRedirectionId
          ? 'common:edit_redirection'
          : 'common:add_redirection',
      )}
      onClose={onClose}
      secondaryButton={{
        testid: 'cancel-btn',
        label: t('common:cancel'),
        onClick: handleCancelClick,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        label: t('common:confirm'),
        isDisabled: !isDirty || !isValid,
        isLoading: isLoadingDomain || isLoadingAccount || isSending,
        onClick: handleSubmit(handleConfirmClick),
      }}
      isLoading={isLoadingDomain || isLoadingAccount}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_add_header')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('common:form_mandatory_fields')}
        </OdsText>
        <Controller
          control={control}
          name="account"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_redirections_add_form_input_from')} *
              </label>
              {editEmailAccountId || editRedirectionId ? (
                <OdsInput
                  type={ODS_INPUT_TYPE.email}
                  data-testid="input-from"
                  id={name}
                  name={name}
                  value={accountDetail?.currentState?.email}
                  isDisabled
                  isReadonly
                />
              ) : (
                <div className="flex">
                  <OdsInput
                    type={ODS_INPUT_TYPE.text}
                    placeholder={t('common:account_name')}
                    className="flex-1"
                    name={name}
                    hasError={!!errors[name]}
                    value={value}
                    defaultValue=""
                    onOdsBlur={onBlur}
                    onOdsChange={onChange}
                  ></OdsInput>
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
                      <OdsSelect
                        name={field.name}
                        hasError={!!errors[field.name]}
                        value={field.value}
                        className="w-1/2"
                        placeholder={t('common:select_domain')}
                        onOdsChange={field.onChange}
                        onOdsBlur={field.onBlur}
                        data-testid="select-domain"
                      >
                        {domains?.map(({ currentState: domain }) => (
                          <option key={domain.name} value={domain.name}>
                            {domain.name}
                          </option>
                        )) || []}
                      </OdsSelect>
                    )}
                  />
                </div>
              )}
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="to"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField
              data-testid="field-to"
              className="w-full"
              error={errors?.[name]?.message}
            >
              <label htmlFor={name} slot="label">
                {t('zimbra_redirections_add_form_input_to')} *
              </label>
              <OdsInput
                data-testid="input-to"
                type={ODS_INPUT_TYPE.text}
                name={name}
                hasError={!!errors[name]}
                value={value}
                defaultValue=""
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              ></OdsInput>
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="keepCopy"
          render={({ field: { name, value, onChange } }) => (
            <OdsFormField
              data-testid="field-checkbox"
              error={errors?.[name]?.message}
            >
              <div className="flex leading-none gap-4">
                <OdsCheckbox
                  inputId={name}
                  id={name}
                  name={name}
                  value={(value as unknown) as string}
                  isChecked={value}
                  onClick={() => onChange(!value)}
                ></OdsCheckbox>
                <label htmlFor={name}>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {t('zimbra_redirections_add_form_input_checkbox')}
                  </OdsText>
                </label>
              </div>
            </OdsFormField>
          )}
        />
      </form>
    </Modal>
  );
}
