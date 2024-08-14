import React, { useEffect, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsMessage,
  OsdsPassword,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
  OsdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXTAREA_SIZE,
} from '@ovhcloud/ods-components';
import { useGenerateUrl, usePlatform } from '@/hooks';
import {
  AccountType,
  postZimbraPlatformAccount,
  putZimbraPlatformAccount,
} from '@/api/account';
import { DomainType } from '@/api/domain';
import { formInputRegex } from './account.constants';

export default function EmailAccountSettings({
  domainList = [],
  editAccountDetail = null,
}: {
  domainList: DomainType[];
  editAccountDetail: AccountType;
}) {
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

  type FieldType = {
    value: string;
    touched: boolean;
    hasError?: boolean;
    required?: boolean;
  };

  interface FormTypeInterface {
    [key: string]: FieldType;
  }

  const [form, setForm] = useState<FormTypeInterface>({
    ...{
      account: {
        value: '',
        touched: false,
        hasError: false,
        required: true,
      },
      domain: {
        value: '',
        touched: false,
        required: true,
      },
      lastName: {
        value: '',
        touched: false,
      },
      firstName: {
        value: '',
        touched: false,
      },
      displayName: {
        value: '',
        touched: false,
      },
      password: {
        value: '',
        touched: false,
        hasError: false,
        required: !editEmailAccountId,
      },
    },
    ...(editEmailAccountId && {
      description: {
        value: '',
        touched: false,
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

  const checkValidityField = (name: string, value: string) => {
    return formInputRegex[name]
      ? formInputRegex[name].test(value) ||
          (!form[name].required && form[name].value === '')
      : true;
  };

  const checkValidityForm = () => {
    const touched = Object.values(form).find((field) => field.touched);
    const error = Object.values(form).find(
      (field) => field.hasError || (field.required && field.value === ''),
    );
    return touched && !error;
  };

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      value,
      touched: true,
      required: form[name].required,
      hasError: !checkValidityField(name, value),
    };
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm);
  };

  const handleDomainChange = (selectedDomain: string) => {
    const organizationLabel = domainList.find(
      ({ currentState }) => currentState.name === selectedDomain,
    )?.currentState.organizationLabel;
    handleFormChange('domain', selectedDomain);
    setSelectedDomainOrganization(organizationLabel);
  };

  const handleNewAccountClick = () => {
    const {
      account: { value: account },
      domain: { value: domain },
    } = form;

    let dataBody = {
      email: `${account}@${domain}`,
    };

    Object.entries(form).forEach(([key, { value }]) => {
      if (!['account', 'domain'].includes(key)) {
        dataBody = { ...dataBody, [key]: value };
      }
    });

    postZimbraPlatformAccount(platformId, dataBody)
      .then(() => {
        goBack();
        addSuccess(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_account_add_success_message')}
          </OsdsText>,
          true,
        );
      })
      .catch(({ response }) => {
        goBack();
        addError(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_account_add_error_message', {
              error: response.data.message,
            })}
          </OsdsText>,
          true,
        );
      });
  };

  const handleModifyAccountClick = () => {
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
          ...['account', 'domain'],
          ...[form.password.value === '' ? 'password' : ''],
        ].includes(key)
      ) {
        dataBody = { ...dataBody, [key]: value };
      }
    });

    putZimbraPlatformAccount(platformId, editEmailAccountId, dataBody)
      .then(() => {
        goBack();
        addSuccess(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_account_edit_success_message')}
          </OsdsText>,
          true,
        );
      })
      .catch(({ response }) => {
        goBack();
        addError(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_account_edit_error_message', {
              error: response.data.message,
            })}
          </OsdsText>,
          true,
        );
      });
  };

  return (
    <div className="w-full md:w-3/4 space-y-5">
      <OsdsText
        className="mt-5"
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      >
        {t('zimbra_account_add_input_mandatory')}
      </OsdsText>

      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_account_add_input_email_label')} *
          </OsdsText>
        </div>
        <div className="flex">
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            name="account"
            placeholder={t('zimbra_account_add_input_email_placeholder')}
            color={
              form.account.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            size={ODS_INPUT_SIZE.md}
            value={form.account.value}
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
            required
            className="rounded-r-none border-r-0 w-1/2"
            data-testid="input-account"
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
            onOdsValueChange={(e) =>
              handleDomainChange(e.detail.value as string)
            }
            data-testid="select-domain"
          >
            <span slot="placeholder">
              {t('zimbra_account_add_select_domain_placeholder')}
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
              form.account.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            className="flex flex-col"
          >
            <span>{t('zimbra_account_add_input_email_helper')}</span>
            {[1, 2, 3].map((elm) => (
              <span key={elm}>
                - {t(`zimbra_account_add_input_email_helper_rule_${elm}`)}
              </span>
            ))}
          </OsdsText>
        </div>
      </OsdsFormField>
      {selectedDomainOrganization && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.primary}
          type={ODS_MESSAGE_TYPE.info}
        >
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          >
            {t('zimbra_account_add_message_organization', {
              organizationLabel: selectedDomainOrganization,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
      <div className="flex">
        <OsdsFormField className="w-full md:w-1/2 pr-6">
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_account_add_input_lastName_label')}
            </OsdsText>
          </div>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            name="lastName"
            placeholder={t('zimbra_account_add_input_lastName_placeholder')}
            color={ODS_THEME_COLOR_INTENT.default}
            size={ODS_INPUT_SIZE.md}
            value={form.lastName.value}
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
          ></OsdsInput>
        </OsdsFormField>

        <OsdsFormField className="w-full md:w-1/2 pl-6">
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_account_add_input_firstName_label')}
            </OsdsText>
          </div>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            name="firstName"
            placeholder={t('zimbra_account_add_input_firstName_placeholder')}
            color={ODS_THEME_COLOR_INTENT.default}
            size={ODS_INPUT_SIZE.md}
            value={form.firstName.value}
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
          ></OsdsInput>
        </OsdsFormField>
      </div>

      <div className={'flex w-full md:w-1/2'}>
        <OsdsFormField className="w-full md:pr-6">
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_account_add_input_displayName_label')}
            </OsdsText>
          </div>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            name="displayName"
            placeholder={t('zimbra_account_add_input_displayName_placeholder')}
            color={ODS_THEME_COLOR_INTENT.default}
            size={ODS_INPUT_SIZE.md}
            value={form.displayName.value}
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
          ></OsdsInput>
        </OsdsFormField>
      </div>

      {editAccountDetail && (
        <div className="flex">
          <OsdsFormField className="w-full">
            <div slot="label">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              >
                {t('zimbra_account_add_input_description_label')}
              </OsdsText>
            </div>
            <OsdsTextarea
              color={ODS_THEME_COLOR_INTENT.default}
              name="description"
              placeholder={t(
                'zimbra_account_add_input_description_placeholder',
              )}
              resizable
              size={ODS_TEXTAREA_SIZE.md}
              value={form.description.value}
              onOdsBlur={({ target: { name, value } }) =>
                handleFormChange(name, value.toString())
              }
              onOdsValueChange={({ detail: { name, value } }) => {
                handleFormChange(name, value);
              }}
            ></OsdsTextarea>
          </OsdsFormField>
        </div>
      )}

      <div className="flex w-full md:w-1/2">
        <OsdsFormField className="w-full md:pr-6">
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_account_add_input_password_label')}
              {!editAccountDetail && ' *'}
            </OsdsText>
          </div>
          <OsdsPassword
            color={ODS_THEME_COLOR_INTENT.default}
            masked={true}
            name="password"
            size={ODS_INPUT_SIZE.md}
            value={form.password.value}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
            data-testid="input-password"
          ></OsdsPassword>
          <div slot="helper">
            <OsdsText
              color={
                form.password.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.default
              }
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              className="flex flex-col"
            >
              <span>{t('zimbra_account_add_input_password_helper')}</span>
              {[1, 2, 3].map((elm) => (
                <span key={elm}>
                  - {t(`zimbra_account_add_input_password_helper_rule_${elm}`)}
                </span>
              ))}
            </OsdsText>
          </div>
        </OsdsFormField>
      </div>

      <div className="flex space-x-5">
        <OsdsButton
          slot="actions"
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          {...(!isFormValid ? { disabled: true } : {})}
          onClick={
            editAccountDetail ? handleModifyAccountClick : handleNewAccountClick
          }
          data-testid="confirm-btn"
        >
          {!editAccountDetail
            ? t('zimbra_account_add_button_confirm')
            : t('zimbra_account_add_button_save')}
        </OsdsButton>

        {editAccountDetail && (
          <OsdsButton
            slot="actions"
            inline
            onClick={goBack}
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.stroked}
          >
            {t('zimbra_account_add_button_cancel')}
          </OsdsButton>
        )}
      </div>
    </div>
  );
}
