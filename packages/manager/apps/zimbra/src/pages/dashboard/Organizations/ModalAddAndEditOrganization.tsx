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
  OsdsIcon,
  OsdsInput,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  ODS_TOOLTIP_VARIANT,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useGenerateUrl, useOrganization, usePlatform } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/api/organization';

type FieldType = {
  value: string;
  touched: boolean;
  hasError: boolean;
};

interface FormTypeInterface {
  [key: string]: FieldType;
}

interface FormInputRegexInterface {
  [key: string]: RegExp;
}

export default function ModalAddAndEditOrganization() {
  const { t } = useTranslation('organizations/addAndEdit');
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editOrganizationId = searchParams?.get('editOrganizationId');
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const formInputRegex: FormInputRegexInterface = {
    name: /^[a-zA-Z0-9]+$/,
    label: /^[a-zA-Z0-9]{1,12}$/,
  };

  const [form, setForm] = useState<FormTypeInterface>({
    name: {
      value: '',
      touched: false,
      hasError: false,
    },
    label: {
      value: '',
      touched: false,
      hasError: false,
    },
  });

  const [isLoading, setIsLoading] = useState(!!editOrganizationId);
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    data: editOrganizationDetail,
    isLoading: isLoadingRequest,
  } = useOrganization(editOrganizationId, true);

  const handleNewOrganizationClick = () => {
    const {
      name: { value: name },
      label: { value: label },
    } = form;
    postZimbraPlatformOrganization(platformId, { name, label })
      .then(() => {
        onClose();
        addSuccess(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_organization_add_success_message')}
          </OsdsText>,
          true,
        );
      })
      .catch(({ response }) => {
        onClose();
        addError(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_organization_add_error_message', {
              error: response.data.message,
            })}
          </OsdsText>,
          true,
        );
      });
  };

  const handleModifyOrganizationClick = () => {
    const {
      name: { value: name },
      label: { value: label },
    } = form;
    putZimbraPlatformOrganization(platformId, editOrganizationId, {
      name,
      label,
    })
      .then(() => {
        onClose();
        addSuccess(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_organization_edit_success_message')}
          </OsdsText>,
          true,
        );
      })
      .catch(({ response }) => {
        onClose();
        addError(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_organization_edit_error_message', {
              error: response.data.message,
            })}
          </OsdsText>,
          true,
        );
      });
  };

  const checkValidityField = (name: string, value: string) => {
    return formInputRegex[name].test(value);
  };

  const checkValidityForm = () => {
    const touched = Object.values(form).find((field) => field.touched);
    const error = Object.values(form).find(
      (field) => field.hasError || field.value === '',
    );
    return touched && !error;
  };

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      value,
      touched: true,
      hasError: !checkValidityField(name, value),
    };
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm);
  };

  useEffect(() => {
    if (editOrganizationDetail && !isLoadingRequest) {
      const { name, label } = editOrganizationDetail.currentState;
      const newForm: FormTypeInterface = form;
      newForm.name.value = name;
      newForm.label.value = label;
      setForm((oldForm) => ({ ...oldForm, ...newForm }));
      setIsLoading(false);
    }
  }, [isLoading, isLoadingRequest, editOrganizationDetail]);

  return (
    <Modal
      title={
        editOrganizationId
          ? t('zimbra_organization_edit_modal_title')
          : t('zimbra_organization_add_modal_title')
      }
      color={ODS_THEME_COLOR_INTENT.info}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoading}
      primaryButton={{
        testid: 'confirm-btn',
        color: ODS_THEME_COLOR_INTENT.primary,
        label: t('zimbra_organization_add'),
        disabled: isLoading || !isFormValid,
        action: editOrganizationId
          ? handleModifyOrganizationClick
          : handleNewOrganizationClick,
      }}
    >
      <>
        {!editOrganizationId && (
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              {t('zimbra_organization_add_modal_content_part1')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              {t('zimbra_organization_add_modal_content_part2')}
            </OsdsText>
          </>
        )}
        <OsdsText
          className="mt-5"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_organization_add_form_input_mandatory')}
        </OsdsText>
        <OsdsFormField
          data-testid="field-name"
          error={
            form.name.hasError
              ? t('zimbra_organization_add_form_input_name_error')
              : ''
          }
          className="mt-5"
        >
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              {t('zimbra_organization_add_form_input_name_title')} *
            </OsdsText>
          </div>

          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            name="name"
            data-testid="input-name"
            placeholder={t(
              'zimbra_organization_add_form_input_name_placeholder',
            )}
            color={
              form.name.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            size={ODS_INPUT_SIZE.md}
            value={form.name.value}
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) => {
              handleFormChange(name, value);
            }}
            required
          ></OsdsInput>
        </OsdsFormField>
        <OsdsFormField
          data-testid="field-label"
          error={
            form.label.hasError
              ? t('zimbra_organization_add_form_input_label_error', {
                  value: 12,
                })
              : ''
          }
          className="mt-5"
        >
          <div slot="label">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              {t('zimbra_organization_add_form_input_label_title')} *
              {
                <OsdsTooltip
                  role="tooltip"
                  variant={ODS_TOOLTIP_VARIANT.standard}
                >
                  <OsdsTooltipContent slot="tooltip-content">
                    <OsdsText
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                      hue={ODS_THEME_COLOR_HUE._500}
                    >
                      {t('zimbra_organization_add_form_input_label_tooltip')}
                    </OsdsText>
                  </OsdsTooltipContent>
                  <OsdsIcon
                    className="ml-2"
                    name={ODS_ICON_NAME.HELP_CIRCLE}
                    size={ODS_ICON_SIZE.xxs}
                  ></OsdsIcon>
                </OsdsTooltip>
              }
            </OsdsText>
          </div>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            data-testid="input-label"
            name="label"
            placeholder={t(
              'zimbra_organization_add_form_input_label_placeholder',
            )}
            color={
              form.label.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.default
            }
            size={ODS_INPUT_SIZE.md}
            value={form.label.value}
            onOdsInputBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsValueChange={({ detail: { name, value } }) =>
              handleFormChange(name, value)
            }
            required
          ></OsdsInput>
          <div slot="helper">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.default}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              {t('zimbra_organization_add_form_input_label_helper', {
                value: 12,
              })}
            </OsdsText>
          </div>
        </OsdsFormField>
      </>
    </Modal>
  );
}
