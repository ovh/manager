import React, { useEffect, useMemo, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCheckbox,
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { Loading } from '@/components';
import { useAccount, useDomains } from '@/data/hooks';
import { useGenerateUrl, useOdsModalOverflowHack } from '@/hooks';
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
  const { accountId, redirectionId } = useParams();

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
  const modalRef = useRef<HTMLOdsModalElement>(undefined);
  useOdsModalOverflowHack(modalRef);

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
      keepCopy: false,
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
      type={ODS_MODAL_COLOR.information}
      ref={modalRef}
      isOpen
      heading={t(redirectionId ? 'common:edit_redirection' : 'common:add_redirection')}
      onDismiss={onClose}
      isLoading={isLoadingAccount}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      primaryButtonTestId="confirm-btn"
      onPrimaryButtonClick={handleSubmit(handleConfirmClick)}
      isPrimaryButtonDisabled={!isDirty || !isValid}
      isPrimaryButtonLoading={isLoadingDomains || isLoadingAccount || isSending}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
      secondaryButtonTestId="cancel-btn"
    >
      <form
        data-testid="redirection-form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('zimbra_redirections_add_header')}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(`${NAMESPACES.FORM}:mandatory_fields`)}
        </OdsText>
        <Controller
          control={control}
          name="account"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_redirections_add_form_input_from')} *
              </label>
              {accountId || redirectionId ? (
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
                    data-testid="input-account"
                    className="flex-1"
                    id={name}
                    name={name}
                    hasError={!!errors[name]}
                    value={value}
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
                      <>
                        <OdsSelect
                          id={field.name}
                          name={field.name}
                          hasError={!!errors[field.name]}
                          value={field.value}
                          className="w-1/2"
                          placeholder={t('common:select_domain')}
                          onOdsChange={field.onChange}
                          onOdsBlur={field.onBlur}
                          isDisabled={isLoadingDomains}
                          data-testid="select-domain"
                        >
                          {domains?.map(({ currentState: domain }) => (
                            <option key={domain.name} value={domain.name}>
                              {domain.name}
                            </option>
                          )) || []}
                        </OdsSelect>
                        {isLoadingDomains && (
                          <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
                        )}
                      </>
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
            <OdsFormField data-testid="field-to" className="w-full" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('zimbra_redirections_add_form_input_to')} *
              </label>
              <OdsInput
                data-testid="input-to"
                type={ODS_INPUT_TYPE.text}
                id={name}
                name={name}
                hasError={!!errors[name]}
                value={value}
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
            <OdsFormField data-testid="field-checkbox" error={errors?.[name]?.message}>
              <div className="flex leading-none gap-4 cursor-pointer">
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
};

export default AddEditOrganizationModal;
