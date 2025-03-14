import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useDomains,
  useGenerateUrl,
  usePlatform,
  useAccount,
  useOdsModalOverflowHack,
} from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  AliasBodyParamsType,
  getZimbraPlatformAliasQueryKey,
  postZimbraPlatformAlias,
} from '@/api/alias';
import { aliasSchema } from '@/utils';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, EMAIL_ACCOUNT_ADD_ALIAS } from '@/tracking.constant';

export default function ModalAddAndEditOrganization() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts/alias', 'common']);
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const [isLoading, setIsLoading] = useState(true);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path', params);
  const onClose = () => navigate(goBackUrl);

  // @TODO refactor when ods modal overflow is fixed
  const modalRef = useRef<HTMLOdsModalElement>(undefined);
  useOdsModalOverflowHack(modalRef);

  const { data: domains, isLoading: isLoadingDomain } = useDomains({
    shouldFetchAll: true,
  });

  const {
    data: editAccountDetail,
    isLoading: isLoadingEmailDetail,
  } = useAccount({ accountId: editEmailAccountId });

  useEffect(() => {
    if (!isLoadingDomain && !isLoadingEmailDetail && platformId) {
      setIsLoading(false);
    }
  }, [isLoadingDomain, isLoadingEmailDetail]);

  const { mutate: addAlias, isPending: isSending } = useMutation({
    mutationFn: (payload: AliasBodyParamsType) => {
      return postZimbraPlatformAlias(platformId, payload);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: EMAIL_ACCOUNT_ADD_ALIAS,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_add_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: EMAIL_ACCOUNT_ADD_ALIAS,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAliasQueryKey(platformId),
      });
      onClose();
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      account: '',
      domain: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(aliasSchema),
  });

  const handleConfirmClick: SubmitHandler<z.infer<typeof aliasSchema>> = ({
    account,
    domain,
  }) => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EMAIL_ACCOUNT_ADD_ALIAS, CONFIRM],
    });

    addAlias({
      alias: `${account}@${domain}`,
      aliasTarget: editAccountDetail?.currentState.email,
      organizationId: editAccountDetail?.currentState.organizationId,
    });
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EMAIL_ACCOUNT_ADD_ALIAS, CANCEL],
    });

    onClose();
  };

  return (
    <Modal
      title={t('common:add_alias')}
      color={ODS_MODAL_COLOR.information}
      isOpen
      onClose={onClose}
      isDismissible
      isLoading={isLoading}
      ref={modalRef}
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleCancelClick,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        label: t('common:confirm'),
        isDisabled: !isDirty || !isValid,
        isLoading: isLoading || isSending,
        onClick: handleSubmit(handleConfirmClick),
      }}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey={'zimbra_account_alias_add_description'}
            values={{
              account: editAccountDetail?.currentState.email,
            }}
          />
        </OdsText>
        <Controller
          control={control}
          name="account"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('common:alias')} *
              </label>
              <div className="flex">
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  placeholder={t('common:alias')}
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
                    <OdsSelect
                      id={field.name}
                      name={field.name}
                      hasError={!!errors[field.name]}
                      value={field.value}
                      className="w-1/2"
                      placeholder={t('common:select_domain')}
                      onOdsChange={field.onChange}
                      onOdsBlur={field.onBlur}
                      data-testid="select-domain"
                    >
                      {domains.map(({ currentState: domain }) => (
                        <option key={domain.name} value={domain.name}>
                          {domain.name}
                        </option>
                      ))}
                    </OdsSelect>
                  )}
                />
              </div>
            </OdsFormField>
          )}
        />
        <OdsText preset={ODS_TEXT_PRESET.caption} className="flex flex-col">
          <span className="block">{t('common:form_email_helper')}</span>
          {[1, 2, 3].map((elm) => (
            <span key={elm} className="block">
              - {t(`common:form_email_helper_rule_${elm}`)}
            </span>
          ))}
        </OdsText>
      </form>
    </Modal>
  );
}
