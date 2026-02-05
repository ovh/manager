import React, { useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

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
  AliasBodyParamsType,
  ResourceStatus,
  getZimbraPlatformAliasesQueryKey,
  postZimbraPlatformAlias,
} from '@/data/api';
import { useAccount, useDomains } from '@/data/hooks';
import { useGenerateUrl, useOdsModalOverflowHack } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, EMAIL_ACCOUNT_ADD_ALIAS } from '@/tracking.constants';
import { aliasSchema } from '@/utils';

export const AddAliasModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts/alias', 'common', NAMESPACES.ACTIONS]);
  const { platformId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  // @TODO refactor when ods modal overflow is fixed
  const modalRef = useRef<HTMLDivElement>(undefined);
  useOdsModalOverflowHack(modalRef as any);

  const { data: target, isLoading } = useAccount();

  const { data: domains, isLoading: isLoadingDomains } = useDomains({
    organizationId: target?.currentState?.organizationId,
    shouldFetchAll: true,
    enabled: !!target,
  });

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
        <Text preset={TEXT_PRESET.paragraph}>{t('zimbra_account_alias_add_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: EMAIL_ACCOUNT_ADD_ALIAS,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAliasesQueryKey(platformId),
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

  const handleConfirmClick: SubmitHandler<z.infer<typeof aliasSchema>> = ({ account, domain }) => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EMAIL_ACCOUNT_ADD_ALIAS, CONFIRM],
    });

    addAlias({
      alias: `${account}@${domain}`,
      targetId: target?.id,
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
      heading={t('common:add_alias')}
      type={MODAL_COLOR.information as any}
      open
      onOpenChange={onClose}
      loading={isLoading}
      ref={modalRef}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        loading: isLoading || isSending,
        disabled: !isDirty || !isValid,
        onClick: handleSubmit(handleConfirmClick),
        testId: 'confirm-btn',
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
      }}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleConfirmClick)}>
        <Text preset={TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey={'zimbra_account_alias_add_description'}
            values={{
              account: target?.currentState?.email,
            }}
          />
        </Text>
        <Controller
          control={control}
          name="account"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField className="w-full" invalid={(isDirty || isTouched) && !!errors?.[name]}>
              <FormFieldLabel htmlFor={name} slot="label">
                {t('common:alias')} *
              </FormFieldLabel>
              <div className="flex">
                <Input
                  type={INPUT_TYPE.text}
                  placeholder={t('common:alias')}
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
                        id={field.name}
                        name={field.name}
                        invalid={(isDirty || isTouched) && !!errors[field.name]}
                        value={[field.value]}
                        disabled={isLoadingDomains || !domains}
                        onValueChange={(detail) => field.onChange(detail.value[0])}
                        onBlur={field.onBlur}
                        data-testid="select-domain"
                        className="w-full"
                      >
                        <SelectControl placeholder={t('common:select_domain')} />
                        <SelectContent createPortal={false} />
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
        <Text preset={TEXT_PRESET.caption} className="flex flex-col">
          <span className="block">{t('common:form_email_helper')}</span>
          {[1, 2, 3].map((elm) => (
            <span key={elm} className="block">
              - {t(`common:form_email_helper_rule_${elm}`)}
            </span>
          ))}
        </Text>
      </form>
    </Modal>
  );
};

export default AddAliasModal;
