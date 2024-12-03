import React, { useEffect, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsPassword,
  OdsSelect,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { useGenerateUrl, usePlatform } from '@/hooks';
import {
  AccountBodyParamsType,
  AccountType,
  getZimbraPlatformAccountsQueryKey,
  postZimbraPlatformAccount,
  putZimbraPlatformAccount,
} from '@/api/account';
import { DomainType } from '@/api/domain';
import {
  ACCOUNT_REGEX,
  checkValidityField,
  checkValidityForm,
  FormTypeInterface,
  PASSWORD_REGEX,
} from '@/utils';
import queryClient from '@/queryClient';

export default function EmailAccountSettings({
  domainList = [],
  editAccountDetail = null,
}: Readonly<{
  domainList: DomainType[];
  editAccountDetail: AccountType;
}>) {
  const { t } = useTranslation('accounts/addAndEdit');
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedDomainOrganization, setSelectedDomainOrganization] = useState(
    '',
  );
  const goBackUrl = useGenerateUrl('..', 'path');

  const goBack = () => {
    return navigate(goBackUrl);
  };

  const [form, setForm] = useState<FormTypeInterface>({
    ...{
      account: {
        value: '',
        defaultValue: '',
        touched: false,
        hasError: false,
        required: true,
        validate: ACCOUNT_REGEX,
      },
      domain: {
        value: '',
        defaultValue: '',
        touched: false,
        hasError: false,
        required: true,
      },
      lastName: {
        value: '',
        defaultValue: '',
        touched: false,
        hasError: false,
        required: false,
      },
      firstName: {
        value: '',
        defaultValue: '',
        touched: false,
        hasError: false,
        required: false,
      },
      displayName: {
        value: '',
        defaultValue: '',
        touched: false,
        hasError: false,
        required: false,
      },
      password: {
        value: '',
        defaultValue: '',
        touched: false,
        hasError: false,
        required: !editEmailAccountId,
        validate: PASSWORD_REGEX,
      },
    },
    ...(editEmailAccountId && {
      description: {
        value: '',
        defaultValue: '',
        touched: false,
        hasError: false,
        required: false,
      },
    }),
  });

  useEffect(() => {
    if (editAccountDetail) {
      const newForm: FormTypeInterface = form;
      const {
        email,
        lastName,
        firstName,
        displayName,
        description,
      } = editAccountDetail.currentState;
      const [account, domain] = email.split('@');
      newForm.account.value = account;
      newForm.domain.value = domain;
      newForm.lastName.value = lastName;
      newForm.firstName.value = firstName;
      newForm.displayName.value = displayName;
      newForm.description.value = description;
      setForm((oldForm) => ({ ...oldForm, ...newForm }));
    }
  }, []);

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      ...form[name],
      value,
      touched: true,
      hasError: !checkValidityField(name, value, form),
    };
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm(form));
  };

  const handleDomainChange = (selectedDomain: string) => {
    const organizationLabel = domainList.find(
      ({ currentState }) => currentState.name === selectedDomain,
    )?.currentState.organizationLabel;
    handleFormChange('domain', selectedDomain);
    setSelectedDomainOrganization(organizationLabel);
  };

  const { mutate: addOrEditEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (params: AccountBodyParamsType) => {
      return editEmailAccountId
        ? putZimbraPlatformAccount(platformId, editEmailAccountId, params)
        : postZimbraPlatformAccount(platformId, params);
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editEmailAccountId
              ? 'zimbra_account_edit_success_message'
              : 'zimbra_account_add_success_message',
          )}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editEmailAccountId
              ? 'zimbra_account_edit_error_message'
              : 'zimbra_account_add_error_message',
            {
              error: error?.response?.data?.message,
            },
          )}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAccountsQueryKey(platformId),
      });
      goBack();
    },
  });

  const handleSaveClick = () => {
    const {
      account: { value: account },
      domain: { value: domain },
    } = form;
    let dataBody = {
      email: `${account}@${domain}`,
    };
    Object.entries(form).forEach(([key, { value }]) => {
      if (
        ![
          'account',
          'domain',
          editEmailAccountId && form.password.value === '' ? 'password' : '',
        ].includes(key)
      ) {
        dataBody = { ...dataBody, [key]: value };
      }
    });

    addOrEditEmailAccount(dataBody);
  };

  return (
    <div className="w-full md:w-3/4 space-y-5">
      <OdsText preset={ODS_TEXT_PRESET.caption} className="block">
        {t('zimbra_account_add_input_mandatory')}
      </OdsText>
      <OdsFormField className="w-full">
        <label slot="label">
          {t('zimbra_account_add_input_email_label')} *
        </label>
        <div className="flex">
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="account"
            placeholder={t('zimbra_account_add_input_email_placeholder')}
            hasError={form.account.hasError}
            value={form.account.value}
            defaultValue={form.account.defaultValue}
            isRequired={form.account.required}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
            className="w-1/2"
            data-testid="input-account"
          ></OdsInput>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name={'@'}
            value={'@'}
            defaultValue={'@'}
            isReadonly
            isDisabled
            className="input-at w-10"
          ></OdsInput>
          <OdsSelect
            name="domain"
            value={form.domain.value}
            isRequired={form.domain.required}
            hasError={form.domain.hasError}
            className="w-1/2"
            placeholder={t('zimbra_account_add_select_domain_placeholder')}
            onOdsChange={(e) => handleDomainChange(e.detail.value)}
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
          <span className="block">
            {t('zimbra_account_add_input_email_helper')}
          </span>
          {[1, 2, 3].map((elm) => (
            <span key={elm} className="block">
              - {t(`zimbra_account_add_input_email_helper_rule_${elm}`)}
            </span>
          ))}
        </OdsText>
      </OdsFormField>
      {selectedDomainOrganization && (
        <OdsMessage isDismissible={false} color={ODS_MESSAGE_COLOR.information}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_account_add_message_organization', {
              organizationLabel: selectedDomainOrganization,
            })}
          </OdsText>
        </OdsMessage>
      )}
      <div className="flex">
        <OdsFormField className="w-full md:w-1/2 pr-6">
          <label slot="label">
            {t('zimbra_account_add_input_lastName_label')}
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="lastName"
            placeholder={t('zimbra_account_add_input_lastName_placeholder')}
            value={form.lastName.value}
            defaultValue={form.lastName.defaultValue}
            isRequired={form.lastName.required}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
          ></OdsInput>
        </OdsFormField>

        <OdsFormField className="w-full md:w-1/2 pl-6">
          <label slot="label">
            {t('zimbra_account_add_input_firstName_label')}
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="firstName"
            placeholder={t('zimbra_account_add_input_firstName_placeholder')}
            value={form.firstName.value}
            defaultValue={form.firstName.defaultValue}
            isRequired={form.firstName.required}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
          ></OdsInput>
        </OdsFormField>
      </div>

      <div className={'flex w-full md:w-1/2'}>
        <OdsFormField className="w-full md:pr-6">
          <label slot="label">
            {t('zimbra_account_add_input_displayName_label')}
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="displayName"
            placeholder={t('zimbra_account_add_input_displayName_placeholder')}
            value={form.displayName.value}
            defaultValue={form.displayName.defaultValue}
            isRequired={form.displayName.required}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
          ></OdsInput>
        </OdsFormField>
      </div>

      {editAccountDetail && (
        <div className="flex">
          <OdsFormField className="w-full">
            <label slot="label">
              {t('zimbra_account_add_input_description_label')}
            </label>
            <OdsTextarea
              name="description"
              placeholder={t(
                'zimbra_account_add_input_description_placeholder',
              )}
              isResizable
              value={form.description.value}
              defaultValue={form.description.defaultValue}
              onOdsBlur={({ target: { name, value } }) =>
                handleFormChange(name, value.toString())
              }
              onOdsChange={({ detail: { name, value } }) => {
                handleFormChange(name, value);
              }}
            ></OdsTextarea>
          </OdsFormField>
        </div>
      )}

      <div className="flex w-full md:w-1/2">
        <OdsFormField className="w-full md:pr-6">
          <label slot="label">
            {t('zimbra_account_add_input_password_label')}
            {!editAccountDetail && ' *'}
          </label>
          <OdsPassword
            isMasked
            name="password"
            className="w-full"
            value={form.password.value}
            defaultValue={form.password.defaultValue}
            hasError={form.password.hasError}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
            data-testid="input-password"
          ></OdsPassword>
          <OdsText
            slot="helper"
            preset={ODS_TEXT_PRESET.caption}
            className="flex flex-col"
          >
            <span className="block">
              {t('zimbra_account_add_input_password_helper')}
            </span>
            {[1, 2, 3].map((elm) => (
              <span key={elm} className="block">
                - {t(`zimbra_account_add_input_password_helper_rule_${elm}`)}
              </span>
            ))}
          </OdsText>
        </OdsFormField>
      </div>

      <div className="flex space-x-5">
        <OdsButton
          slot="actions"
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!isFormValid}
          isLoading={isSending}
          onClick={handleSaveClick}
          data-testid="confirm-btn"
          label={
            !editAccountDetail
              ? t('zimbra_account_add_button_confirm')
              : t('zimbra_account_add_button_save')
          }
        />

        {editAccountDetail && (
          <OdsButton
            slot="actions"
            onClick={goBack}
            color={ODS_BUTTON_COLOR.primary}
            variant={ODS_BUTTON_VARIANT.outline}
            label={t('zimbra_account_add_button_cancel')}
          />
        )}
      </div>
    </div>
  );
}
