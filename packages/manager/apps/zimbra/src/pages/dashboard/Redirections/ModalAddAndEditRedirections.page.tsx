import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsCheckboxButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import Modal from '@/components/Modals/Modal';
import { useAccount, useDomains, useGenerateUrl } from '@/hooks';
import {
  FormTypeInterface,
  FormInputRegexInterface,
  checkValidityField,
  checkValidityForm,
  ACCOUNT_REGEX,
  EMAIL_REGEX,
} from '@/utils';
import Loading from '@/components/Loading/Loading';

export default function ModalAddAndEditRedirections() {
  const { t } = useTranslation('redirections/addAndEdit');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const editRedirectionId = searchParams.get('editRedirectionId');
  const params = Object.fromEntries(searchParams.entries());
  delete params.editRedirectionId;

  const goBackUrl = useGenerateUrl('..', 'path', params);
  const onClose = () => navigate(goBackUrl);

  const { addError, addSuccess } = useNotifications();
  const [isFormValid, setIsFormValid] = useState(false);

  const { data: domainList, isLoading: isLoadingDomain } = useDomains({
    enabled: !editEmailAccountId && !editRedirectionId,
  });

  const { data: accountDetail, isLoading: isLoadingAccount } = useAccount({
    accountId: editEmailAccountId,
    enabled: !!editEmailAccountId,
  });

  const formInputRegex: FormInputRegexInterface = {
    account: ACCOUNT_REGEX,
    to: EMAIL_REGEX,
  };

  const [form, setForm] = useState<FormTypeInterface>({
    account: {
      value: '',
      touched: false,
      hasError: false,
      required: !editEmailAccountId,
    },
    domain: {
      value: '',
      touched: false,
      hasError: false,
      required: !editEmailAccountId,
    },
    to: {
      value: '',
      touched: false,
      hasError: false,
      required: true,
    },
    checked: {
      value: '',
      touched: false,
      hasError: false,
      required: false,
    },
  });

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      value,
      touched: true,
      required: form[name].required,
      hasError: !checkValidityField(name, value, formInputRegex, form),
    };
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm(form));
  };

  /* const getDataBody = useCallback(
    (formRef: FormTypeInterface) => {
      const {
        account: { value: account },
        domain: { value: domain },
      } = form;

      let dataBody: Record<string, string | boolean> = {};

      dataBody.from =
        account && domain
          ? `${account}@${domain}`
          : accountDetail?.currentState.email;

      Object.entries(formRef).forEach(([key, { value }]) => {
        if (!['account', 'domain'].includes(key)) {
          dataBody = { ...dataBody, [key]: value };
        }
      });

      dataBody.checked = dataBody?.checked === 'checked';

      return dataBody;
    },
    [form],
  ); */

  const handleClickConfirm = () => {
    if (isFormValid) {
      addSuccess(
        t(
          editRedirectionId
            ? 'zimbra_redirections_edit_success'
            : 'zimbra_redirections_add_success',
        ),
      );
    } else {
      addError(
        t(
          editRedirectionId
            ? 'zimbra_redirections_edit_error'
            : 'zimbra_redirections_add_error',
        ),
      );
    }
    onClose();
  };

  return (
    <Modal
      color={ODS_THEME_COLOR_INTENT.primary}
      dismissible
      title={t(
        editRedirectionId
          ? 'zimbra_redirections_title_edit'
          : 'zimbra_redirections_title_add',
      )}
      onDismissible={onClose}
      secondaryButton={{
        testid: 'cancel-btn',
        color: ODS_THEME_COLOR_INTENT.primary,
        label: t('zimbra_redirections_add_btn_cancel'),
        action: onClose,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        color: ODS_THEME_COLOR_INTENT.primary,
        label: t('zimbra_redirections_add_btn_confirm'),
        action: handleClickConfirm,
        disabled: !isFormValid,
      }}
      isLoading={isLoadingDomain || isLoadingAccount}
    >
      <>
        <OsdsText
          className="mt-5"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          <div>{t('zimbra_redirections_edit_1')}</div>
        </OsdsText>
        <OsdsText
          className="my-5"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          <div>{t('zimbra_redirections_edit_2')}</div>
        </OsdsText>

        <OsdsFormField data-testid="field-from" className="mt-5">
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_redirections_add_form_input_name_title_from')} *
            </OsdsText>
          </div>
          {editEmailAccountId || editRedirectionId ? (
            <OsdsInput
              type={ODS_INPUT_TYPE.email}
              data-testid="input-from"
              name="from"
              value={accountDetail?.currentState?.email}
              disabled={true}
              readOnly={true}
            />
          ) : (
            <>
              <div className="flex">
                <OsdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="account"
                  placeholder={t(
                    'zimbra_redirections_add_input_email_placeholder',
                  )}
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
                  data-testid="select-domain"
                  {...(isLoadingDomain && { disabled: true })}
                  onOdsValueChange={({ detail: { name, value } }) =>
                    handleFormChange(name, value as string)
                  }
                >
                  <span slot="placeholder">
                    {t('zimbra_redirections_add_select_domain_placeholder')}
                  </span>
                  {domainList?.map(({ currentState: domain }) => (
                    <OsdsSelectOption key={domain.name} value={domain.name}>
                      {domain.name}
                    </OsdsSelectOption>
                  ))}
                </OsdsSelect>
              </div>
              {isLoadingDomain && (
                <div slot="helper">
                  <Loading />
                </div>
              )}
            </>
          )}
        </OsdsFormField>
        <OsdsFormField data-testid="field-to" className="mt-5">
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_redirections_add_form_input_name_title_to')} *
            </OsdsText>
          </div>
          <OsdsInput
            type={ODS_INPUT_TYPE.email}
            data-testid="input-to"
            name="to"
            value={form.to.value}
            error={form.to.hasError}
            color={
              form.to.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) =>
              handleFormChange(name, value)
            }
            required
          />
        </OsdsFormField>

        <OsdsFormField data-testid="field-checkbox" className="mt-5">
          <OsdsCheckboxButton
            size={ODS_CHECKBOX_BUTTON_SIZE.sm}
            checked={form.checked.value === 'checked'}
            onClick={() =>
              handleFormChange(
                'checked',
                form.checked.value === 'checked' ? '' : 'checked',
              )
            }
          >
            <span slot="end">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              >
                {t('zimbra_redirections_add_form_input_checkbox')}
              </OsdsText>
            </span>
          </OsdsCheckboxButton>
        </OsdsFormField>
      </>
    </Modal>
  );
}
