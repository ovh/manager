import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editOrganizationId
              ? 'zimbra_organization_edit_success_message'
              : 'zimbra_organization_add_success_message',
          )}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editOrganizationId
              ? 'zimbra_organization_add_error_message'
              : 'zimbra_organization_edit_error_message',
            {
              error: error.response?.data?.message,
            },
          )}
        </OdsText>,
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
      isOpen
      title={
        editOrganizationId
          ? t('zimbra_organization_edit_modal_title')
          : t('zimbra_organization_add_modal_title')
      }
      color={ODS_MODAL_COLOR.information}
      onDismissible={onClose}
      isDismissible
      isLoading={isLoading}
      primaryButton={{
        testid: 'confirm-btn',
        color: ODS_BUTTON_COLOR.primary,
        label: t('zimbra_organization_add'),
        disabled: isLoading || !isFormValid || isSending,
        action: handleSaveClick,
      }}
    >
      <>
        {!editOrganizationId && (
          <>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_organization_add_modal_content_part1')}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_organization_add_modal_content_part2')}
            </OdsText>
          </>
        )}

        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-5">
          {t('zimbra_organization_add_form_input_mandatory')}
        </OdsText>
        <OdsFormField
          data-testid="field-name"
          error={
            form.name.hasError
              ? t('zimbra_organization_add_form_input_name_error')
              : ''
          }
          className="mt-5"
        >
          <label slot="label">
            {t('zimbra_organization_add_form_input_name_title')} *
          </label>

          <OdsInput
            type={ODS_INPUT_TYPE.text}
            name="name"
            data-testid="input-name"
            placeholder={t(
              'zimbra_organization_add_form_input_name_placeholder',
            )}
            hasError={form.name.hasError}
            value={form.name.value}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) => {
              handleFormChange(name, String(value));
            }}
            isRequired
          ></OdsInput>
        </OdsFormField>
        <OdsFormField
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
          <label slot="label">
            {t('zimbra_organization_add_form_input_label_title')} *
            {
              <OdsTooltip role="tooltip" triggerId="tooltip-trigger">
                <div id="tooltip-trigger">
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                    {t('zimbra_organization_add_form_input_label_tooltip')}
                  </OdsText>
                </div>
                <OdsIcon
                  className="ml-2"
                  name={ODS_ICON_NAME.circleQuestion}
                ></OdsIcon>
              </OdsTooltip>
            }
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            data-testid="input-label"
            name="label"
            placeholder={t(
              'zimbra_organization_add_form_input_label_placeholder',
            )}
            hasError={form.label.hasError}
            value={form.label.value}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) =>
              handleFormChange(name, String(value))
            }
            isRequired
          ></OdsInput>
          <div slot="helper">
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_organization_add_form_input_label_helper', {
                value: 12,
              })}
            </OdsText>
          </div>
        </OdsFormField>
      </>
    </Modal>
  );
}
