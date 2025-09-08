import React, { useEffect, useRef, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';

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
import {
  AliasBodyParamsType,
  DomainType,
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
  const modalRef = useRef<HTMLOdsModalElement>(undefined);
  useOdsModalOverflowHack(modalRef);

  const { data: target, isLoading } = useAccount();

  const { data: domains, isLoading: isLoadingDomains } = useDomains({
    organizationId: target?.currentState?.organizationId,
    shouldFetchAll: true,
    enabled: !!target,
  });

  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackDomains, setHackDomains] = useState<DomainType[]>([]);
  const [hackKeyDomains, setHackKeyDomains] = useState(Date.now());

  useEffect(() => {
    setHackDomains(
      (domains || []).filter((domain) => domain.resourceStatus === ResourceStatus.READY),
    );
    setHackKeyDomains(Date.now());
  }, [domains]);

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
      type={ODS_MODAL_COLOR.information}
      isOpen
      onDismiss={onClose}
      isLoading={isLoading}
      ref={modalRef}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      primaryButtonTestId="confirm-btn"
      isPrimaryButtonDisabled={!isDirty || !isValid}
      isPrimaryButtonLoading={isLoading || isSending}
      onPrimaryButtonClick={handleSubmit(handleConfirmClick)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleConfirmClick)}>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey={'zimbra_account_alias_add_description'}
            values={{
              account: target?.currentState?.email,
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
                    <div className="flex flex-1">
                      <OdsSelect
                        key={hackKeyDomains}
                        id={field.name}
                        name={field.name}
                        hasError={!!errors[field.name]}
                        value={field.value}
                        isDisabled={isLoadingDomains || !domains}
                        placeholder={t('common:select_domain')}
                        onOdsChange={field.onChange}
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
};

export default AddAliasModal;
