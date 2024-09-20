import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsCheckboxButton,
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import Modal from '@/components/Modals/Modal';
import { useGenerateUrl } from '@/hooks';
import {
  FormTypeInterface,
  FormInputRegexInterface,
  checkValidityField,
  checkValidityForm,
} from '@/utils';
import { EMAIL_REGEX } from './Redirections.constants';

export default function ModalAddAndEditRedirections() {
  const { t } = useTranslation('redirections/addAndEdit');
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const goBack = () => navigate(goBackUrl);
  const { addError, addSuccess } = useNotifications();

  const [isFormValid, setIsFormValid] = useState(false);

  const formInputRegex: FormInputRegexInterface = {
    from: EMAIL_REGEX,
    to: EMAIL_REGEX,
  };

  const [form, setForm] = useState<FormTypeInterface>({
    from: {
      value: '',
      touched: false,
      hasError: false,
      required: true,
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
      required: true,
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

  const handleClickConfirm = () => {
    if (isFormValid) {
      addSuccess(t('zimbra_redirections_alias_add_success'));
    } else {
      addError(t('zimbra_redirections_alias_add_error'));
    }
  };

  return (
    <Modal
      color={ODS_THEME_COLOR_INTENT.primary}
      dismissible
      title={t('zimbra_redirections_title')}
      onDismissible={goBack}
      secondaryButton={{
        testid: 'cancel-btn',
        color: ODS_THEME_COLOR_INTENT.primary,
        label: t('zimbra_redirections_alias_add_btn_cancel'),
        action: goBack,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        color: ODS_THEME_COLOR_INTENT.primary,
        label: t('zimbra_redirections_alias_add_btn_confirm'),
        action: handleClickConfirm,
        disabled: !isFormValid,
      }}
    >
      <>
        <OsdsText
          className="mt-5 mb-5"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          <div>{t('zimbra_redirections_edit_1')}</div>
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
          <OsdsInput
            type={ODS_INPUT_TYPE.email}
            data-testid="input-from"
            name="from"
            value={form.from.value}
            error={form.from.hasError}
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) =>
              handleFormChange(name, value)
            }
            required
          />
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
