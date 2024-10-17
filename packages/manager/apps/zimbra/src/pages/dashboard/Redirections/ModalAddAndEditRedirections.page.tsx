import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsCheckbox,
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_COLOR,
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
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
      isOpen
      color={ODS_MODAL_COLOR.information}
      isDismissible
      title={t(
        editRedirectionId
          ? 'zimbra_redirections_title_edit'
          : 'zimbra_redirections_title_add',
      )}
      onDismissible={onClose}
      secondaryButton={{
        testid: 'cancel-btn',
        color: ODS_BUTTON_COLOR.primary,
        label: t('zimbra_redirections_add_btn_cancel'),
        action: onClose,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        color: ODS_BUTTON_COLOR.primary,
        label: t('zimbra_redirections_add_btn_confirm'),
        action: handleClickConfirm,
        disabled: !isFormValid,
      }}
      isLoading={isLoadingDomain || isLoadingAccount}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <div>{t('zimbra_redirections_edit_1')}</div>
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="my-5">
          <div>{t('zimbra_redirections_edit_2')}</div>
        </OdsText>

        <OdsFormField data-testid="field-from" className="mt-5">
          <label slot="label">
            {t('zimbra_redirections_add_form_input_name_title_from')} *
          </label>
          {editEmailAccountId || editRedirectionId ? (
            <OdsInput
              type={ODS_INPUT_TYPE.email}
              data-testid="input-from"
              name="from"
              value={accountDetail?.currentState?.email}
              isDisabled
              isReadonly
            />
          ) : (
            <>
              <div className="flex">
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="account"
                  placeholder={t(
                    'zimbra_redirections_add_input_email_placeholder',
                  )}
                  hasError={form.account.hasError}
                  value={form.account.value}
                  onOdsBlur={({ target: { name, value } }) =>
                    handleFormChange(name, value.toString())
                  }
                  onOdsChange={({ detail: { name, value } }) => {
                    handleFormChange(name, String(value));
                  }}
                  isRequired
                  className="rounded-r-none border-r-0 w-1/2"
                  data-testid="input-account"
                ></OdsInput>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  value={'@'}
                  name={'@'}
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
                  data-testid="select-domain"
                  {...(isLoadingDomain && { disabled: true })}
                  onOdsChange={({ detail: { name, value } }) =>
                    handleFormChange(name, value)
                  }
                >
                  <span slot="placeholder">
                    {t('zimbra_redirections_add_select_domain_placeholder')}
                  </span>
                  {domainList?.map(({ currentState: domain }) => (
                    <option key={domain.name} value={domain.name}>
                      {domain.name}
                    </option>
                  ))}
                </OdsSelect>
              </div>
              {isLoadingDomain && (
                <div slot="helper">
                  <Loading />
                </div>
              )}
            </>
          )}
        </OdsFormField>
        <OdsFormField data-testid="field-to" className="mt-5">
          <label slot="label">
            {t('zimbra_redirections_add_form_input_name_title_to')} *
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.email}
            data-testid="input-to"
            name="to"
            value={form.to.value}
            hasError={form.to.hasError}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) =>
              handleFormChange(name, String(value))
            }
            isRequired
          />
        </OdsFormField>

        <OdsFormField data-testid="field-checkbox" className="mt-5">
          <OdsCheckbox
            isChecked={form.checked.value === 'checked'}
            onClick={() =>
              handleFormChange(
                'checked',
                form.checked.value === 'checked' ? '' : 'checked',
              )
            }
            name="checkbox-button-redirection"
          >
            {t('zimbra_redirections_add_form_input_checkbox')}
          </OdsCheckbox>
        </OdsFormField>
      </>
    </Modal>
  );
}
