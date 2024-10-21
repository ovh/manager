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
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useGenerateUrl, useOrganization, usePlatform } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  getZimbraPlatformOrganizationQueryKey,
  OrganizationBodyParamsType,
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/api/organization';
import queryClient from '@/queryClient';
import {
  checkValidityField,
  checkValidityForm,
  FormInputRegexInterface,
  FormTypeInterface,
} from '@/utils';

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
    name: /^.+$/,
    label: /^.{1,12}$/,
  };

  const [form, setForm] = useState<FormTypeInterface>({
    name: {
      value: '',
      touched: false,
      hasError: false,
      required: true,
    },
    label: {
      value: '',
      touched: false,
      hasError: false,
      required: true,
    },
  });

  const [isLoading, setIsLoading] = useState(!!editOrganizationId);
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    data: editOrganizationDetail,
    isLoading: isLoadingRequest,
  } = useOrganization(editOrganizationId, true);

  const { mutate: addOrEditOrganization, isPending: isSending } = useMutation({
    mutationFn: (params: OrganizationBodyParamsType) => {
      return editOrganizationId
        ? putZimbraPlatformOrganization(platformId, editOrganizationId, params)
        : postZimbraPlatformOrganization(platformId, params);
    },
    onSuccess: () => {
      addSuccess(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t(
            editOrganizationId
              ? 'zimbra_organization_edit_success_message'
              : 'zimbra_organization_add_success_message',
          )}
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
          {t(
            editOrganizationId
              ? 'zimbra_organization_add_error_message'
              : 'zimbra_organization_edit_error_message',
            {
              error: error.response?.data?.message,
            },
          )}
        </OsdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
      });
      onClose();
    },
  });

  const handleSaveClick = () => {
    const {
      name: { value: name },
      label: { value: label },
    } = form;
    addOrEditOrganization({ name, label });
  };

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
        disabled: isLoading || !isFormValid || isSending,
        action: handleSaveClick,
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
