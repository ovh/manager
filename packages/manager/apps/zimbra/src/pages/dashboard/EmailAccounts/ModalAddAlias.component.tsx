import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDomains, useGenerateUrl, usePlatform, useAccount } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  getZimbraPlatformAliasQueryKey,
  postZimbraPlatformAlias,
} from '@/api/alias';
import { formInputRegex } from './account.constants';
import {
  checkValidityField,
  checkValidityForm,
  FormTypeInterface,
} from '@/utils';
import queryClient from '@/queryClient';

export default function ModalAddAndEditOrganization() {
  const { t } = useTranslation('accounts/alias/add');
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const [isLoading, setIsLoading] = useState(true);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path', { editEmailAccountId });
  const goBack = () => navigate(goBackUrl);

  const [form, setForm] = useState<FormTypeInterface>({
    alias: {
      value: '',
      hasError: false,
      required: true,
      touched: false,
    },
    domain: {
      value: '',
      hasError: false,
      required: true,
      touched: false,
    },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const { data: domainList, isLoading: isLoadingDomain } = useDomains();

  const {
    data: editAccountDetail,
    isLoading: isLoadingEmailDetail,
  } = useAccount({ accountId: editEmailAccountId });

  useEffect(() => {
    if (!isLoadingDomain && !isLoadingEmailDetail && platformId) {
      setIsLoading(false);
    }
  }, [isLoadingDomain, isLoadingEmailDetail]);

  const { mutate: handleNewAliasClick, isPending: isSubmitting } = useMutation({
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
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_account_alias_add_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
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
      goBack();
    },
  });

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

  return (
    <Modal
      title={t('zimbra_account_alias_add_modal_title')}
      color={ODS_MODAL_COLOR.information}
      isOpen
      onDismissible={goBack}
      isDismissible
      isLoading={isLoading}
      primaryButton={{
        testid: 'confirm-btn',
        color: ODS_BUTTON_COLOR.primary,
        label: t('zimbra_account_alias_add_btn_confirm'),
        disabled: isLoading || !isFormValid || isSubmitting,
        action: handleNewAliasClick,
      }}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-5 mb-5">
          {t('zimbra_account_alias_add_description', {
            account: editAccountDetail?.currentState.email,
          })}
        </OdsText>

        <OdsFormField>
          <div className="flex">
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              name="alias"
              placeholder={t(
                'zimbra_account_alias_add_input_email_placeholder',
              )}
              hasError={form.alias.hasError}
              value={form.alias.value}
              onOdsBlur={({ target: { name, value } }) =>
                handleFormChange(name, value.toString())
              }
              onOdsChange={({ detail: { name, value } }) => {
                handleFormChange(name, String(value));
              }}
              isRequired
              className="rounded-r-none border-r-0 w-1/2"
              data-testid="input-alias"
            ></OdsInput>
            <OdsInput
              name={'@'}
              type={ODS_INPUT_TYPE.text}
              value={'@'}
              isReadonly
              isDisabled
              className="w-10 rounded-none pl-5 pr-0"
            ></OdsInput>
            <OdsSelect
              name="domain"
              value={form.domain.value}
              className="rounded-l-none border-l-0 w-1/2"
              hasError={form.domain.hasError}
              isRequired
              onOdsChange={({ detail: { name, value } }) =>
                handleFormChange(name, value)
              }
              data-testid="select-domain"
            >
              <span slot="placeholder">
                {t('zimbra_account_alias_add_select_domain_placeholder')}
              </span>
              {domainList?.map(({ currentState: domain }) => (
                <option key={domain.name} value={domain.name}>
                  {domain.name}
                </option>
              ))}
            </OdsSelect>
          </div>
          <div slot="helper">
            <OdsText
              preset={ODS_TEXT_PRESET.paragraph}
              className="flex flex-col"
            >
              <span>{t('zimbra_account_alias_add_input_email_helper')}</span>
              {[1, 2, 3].map((elm) => (
                <span key={elm}>
                  -
                  {t(`zimbra_account_alias_add_input_email_helper_rule_${elm}`)}
                </span>
              ))}
            </OdsText>
          </div>
        </OdsFormField>
      </>
    </Modal>
  );
}
