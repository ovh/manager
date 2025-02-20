import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
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
import { useDomains, useGenerateUrl, usePlatform, useAccount } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  getZimbraPlatformAliasQueryKey,
  postZimbraPlatformAlias,
} from '@/api/alias';
import { ACCOUNT_REGEX } from '@/utils';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, EMAIL_ACCOUNT_ADD_ALIAS } from '@/tracking.constant';
import { useForm } from '@/hooks/useForm';

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

  const { form, isFormValid, setValue } = useForm({
    alias: {
      value: '',
      defaultValue: '',
      required: true,
      validate: ACCOUNT_REGEX,
    },
    domain: {
      value: '',
      defaultValue: '',
      required: true,
    },
  });

  const { data: domainList, isLoading: isLoadingDomain } = useDomains({
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

  const { mutate: addAlias, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      const {
        alias: { value: alias },
        domain: { value: domain },
      } = form;

      const dataBody = {
        alias: `${alias}@${domain}`,
        aliasTarget: editAccountDetail?.currentState.email,
        organizationId: editAccountDetail?.currentState.organizationId,
      };
      return postZimbraPlatformAlias(platformId, dataBody);
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

  const handleConfirmClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EMAIL_ACCOUNT_ADD_ALIAS, CONFIRM],
    });

    addAlias();
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
      secondaryButton={{
        label: t('common:cancel'),
        action: handleCancelClick,
        testid: 'cancel-btn',
      }}
      primaryButton={{
        testid: 'confirm-btn',
        variant: ODS_BUTTON_VARIANT.default,
        label: t('common:confirm'),
        isDisabled: !isFormValid,
        isLoading: isLoading || isSubmitting,
        action: handleConfirmClick,
      }}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-5 mb-5">
          <Trans
            t={t}
            i18nKey={'zimbra_account_alias_add_description'}
            values={{
              account: editAccountDetail?.currentState.email,
            }}
          />
        </OdsText>

        <OdsFormField>
          <div className="flex">
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              name="alias"
              placeholder={t('common:alias')}
              value={form.alias.value}
              defaultValue={form.alias.defaultValue}
              isRequired={form.alias.required}
              hasError={form.alias.hasError}
              onOdsBlur={({ target: { name, value } }) =>
                setValue(name, value.toString(), true)
              }
              onOdsChange={({ detail: { name, value } }) => {
                setValue(name, String(value));
              }}
              className="rounded-r-none border-r-0 w-1/2"
              data-testid="input-alias"
            ></OdsInput>
            <OdsInput
              name={'@'}
              type={ODS_INPUT_TYPE.text}
              value={'@'}
              isReadonly
              isDisabled
              className="input-at w-10"
            ></OdsInput>
            <OdsSelect
              name="domain"
              value={form.domain.value}
              defaultValue={form.domain.defaultValue}
              isRequired={form.domain.required}
              hasError={form.domain.hasError}
              placeholder={t('common:select_domain')}
              className="w-1/2"
              onOdsChange={({ detail: { name, value } }) =>
                setValue(name, value)
              }
              data-testid="select-domain"
            >
              {domainList?.map(({ currentState: domain }) => (
                <option key={domain.name} value={domain.name}>
                  {domain.name}
                </option>
              ))}
            </OdsSelect>
          </div>
          <OdsText
            slot="helper"
            preset={ODS_TEXT_PRESET.caption}
            className="flex flex-col"
          >
            <span className="block">{t('common:form_email_helper')}</span>
            {[1, 2, 3].map((elm) => (
              <span key={elm} className="block">
                - {t(`common:form_email_helper_rule_${elm}`)}
              </span>
            ))}
          </OdsText>
        </OdsFormField>
      </>
    </Modal>
  );
}
