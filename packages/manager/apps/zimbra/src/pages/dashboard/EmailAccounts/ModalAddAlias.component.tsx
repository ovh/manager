import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_INPUT_SIZE, ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useDomains, useGenerateUrl, usePlatform, useAccount } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import { postZimbraPlatformAlias } from '@/api/alias';
import { formInputRegex } from './account.constants';

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

  type FieldType = {
    value: string;
    hasError?: boolean;
    required?: boolean;
  };

  interface FormTypeInterface {
    [key: string]: FieldType;
  }

  const [form, setForm] = useState<FormTypeInterface>({
    alias: {
      value: '',
      hasError: false,
      required: true,
    },
    domain: {
      value: '',
      required: true,
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
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_alias_add_success_message')}
        </OsdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_alias_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </OsdsText>,
        true,
      );
    },
    onSettled: () => {
      goBack();
    },
  });

  const checkValidityField = (name: string, value: string) => {
    return formInputRegex[name]
      ? formInputRegex[name].test(value) ||
          (!form[name].required && form[name].value === '')
      : true;
  };

  const checkValidityForm = () => {
    const error = Object.values(form).find(
      (field) => field.hasError || (field.required && field.value === ''),
    );
    return !error;
  };

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      value,
      required: form[name].required,
      hasError: !checkValidityField(name, value),
    };
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm);
  };

  return (
    <Modal
      title={t('zimbra_account_alias_add_modal_title')}
      color={ODS_THEME_COLOR_INTENT.info}
      onDismissible={goBack}
      dismissible={true}
      isLoading={isLoading}
      primaryButton={{
        testid: 'confirm-btn',
        color: ODS_THEME_COLOR_INTENT.primary,
        label: t('zimbra_account_alias_add_btn_confirm'),
        disabled: isLoading || !isFormValid || isSubmitting,
        action: handleNewAliasClick,
      }}
    >
      <>
        <OsdsText
          className="mt-5 mb-5"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_account_alias_add_description', {
            account: editAccountDetail?.currentState.email,
          })}
        </OsdsText>

        <OsdsFormField>
          <div className="flex">
            <OsdsInput
              type={ODS_INPUT_TYPE.text}
              name="alias"
              placeholder={t(
                'zimbra_account_alias_add_input_email_placeholder',
              )}
              color={
                form.alias.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.default
              }
              size={ODS_INPUT_SIZE.md}
              value={form.alias.value}
              onOdsInputBlur={({ target: { name, value } }) =>
                handleFormChange(name, value.toString())
              }
              onOdsValueChange={({ detail: { name, value } }) => {
                handleFormChange(name, value);
              }}
              required
              className="rounded-r-none border-r-0 w-1/2"
              data-testid="input-alias"
            ></OsdsInput>
            <OsdsInput
              type={ODS_INPUT_TYPE.text}
              color={ODS_THEME_COLOR_INTENT.default}
              size={ODS_INPUT_SIZE.md}
              value={'@'}
              readOnly={true}
              disabled={true}
              className="w-10 rounded-none pl-5 pr-0"
            ></OsdsInput>
            <OsdsSelect
              name="domain"
              value={form.domain.value}
              className="rounded-l-none border-l-0 w-1/2"
              color={
                form.domain.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.default
              }
              required
              onOdsValueChange={({ detail: { name, value } }) =>
                handleFormChange(name, value as string)
              }
              data-testid="select-domain"
            >
              <span slot="placeholder">
                {t('zimbra_account_alias_add_select_domain_placeholder')}
              </span>
              {domainList?.map(({ currentState: domain }) => (
                <OsdsSelectOption key={domain.name} value={domain.name}>
                  {domain.name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </div>
          <div slot="helper">
            <OsdsText
              color={
                form.alias.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.default
              }
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              className="flex flex-col"
            >
              <span>{t('zimbra_account_alias_add_input_email_helper')}</span>
              {[1, 2, 3].map((elm) => (
                <span key={elm}>
                  -{' '}
                  {t(`zimbra_account_alias_add_input_email_helper_rule_${elm}`)}
                </span>
              ))}
            </OsdsText>
          </div>
        </OsdsFormField>
      </>
    </Modal>
  );
}
