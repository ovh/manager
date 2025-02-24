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
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
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
  ADD_ORGANIZATION,
  CANCEL,
  CONFIRM,
  EDIT_ORGANIZATION,
} from '@/tracking.constant';
import { FormTypeInterface, useForm } from '@/hooks/useForm';

export default function ModalAddAndEditOrganization() {
  const { t } = useTranslation(['organizations/form', 'common']);
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const editOrganizationId = searchParams?.get('editOrganizationId');
  const trackingName = editOrganizationId
    ? EDIT_ORGANIZATION
    : ADD_ORGANIZATION;
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => {
    navigate(goBackUrl);
  };

  const { form, setForm, isFormValid, setValue } = useForm({
    name: {
      value: '',
      defaultValue: '',
      required: true,
      validate: /^.+$/,
    },
    label: {
      value: '',
      defaultValue: '',
      required: true,
      validate: /^.{1,12}$/,
    },
  });

  const [isLoading, setIsLoading] = useState(!!editOrganizationId);

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
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editOrganizationId
              ? 'common:edit_success_message'
              : 'zimbra_organization_add_success_message',
          )}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            editOrganizationId
              ? 'common:edit_error_message'
              : 'zimbra_organization_add_error_message',
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

    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });
    addOrEditOrganization({ name, label });
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CANCEL],
    });
    onClose();
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
          ? t('common:edit_organization')
          : t('common:add_organization')
      }
      color={ODS_MODAL_COLOR.information}
      onClose={onClose}
      isDismissible
      isLoading={isLoading}
      secondaryButton={{
        label: t('common:cancel'),
        action: handleCancelClick,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        variant: ODS_BUTTON_VARIANT.default,
        label: t('common:confirm'),
        isDisabled: !isFormValid,
        isLoading: isLoading || isSending,
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
        <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-5">
          {t('common:form_mandatory_fields')}
        </OdsText>
        <OdsFormField
          data-testid="field-name"
          error={form.name.hasError ? t('common:form_required_field') : ''}
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
            defaultValue={form.name.defaultValue}
            isRequired={form.name.required}
            onOdsBlur={({ target: { name, value } }) =>
              setValue(name, value.toString(), true)
            }
            onOdsChange={({ detail: { name, value } }) => {
              setValue(name, String(value));
            }}
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
          <label htmlFor="label" slot="label">
            {t('zimbra_organization_add_form_input_label_title')} *
            <OdsIcon
              id="tooltip-trigger"
              className="ml-3 text-xs"
              name={ODS_ICON_NAME.circleQuestion}
            ></OdsIcon>
            <OdsTooltip
              role="tooltip"
              strategy="fixed"
              triggerId="tooltip-trigger"
            >
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_organization_add_form_input_label_tooltip')}
              </OdsText>
            </OdsTooltip>
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            data-testid="input-label"
            id="label"
            name="label"
            placeholder={t(
              'zimbra_organization_add_form_input_label_placeholder',
            )}
            hasError={form.label.hasError}
            value={form.label.value}
            defaultValue={form.label.defaultValue}
            isRequired={form.label.required}
            onOdsBlur={({ target: { name, value } }) =>
              setValue(name, value.toString(), true)
            }
            onOdsChange={({ detail: { name, value } }) =>
              setValue(name, String(value))
            }
          ></OdsInput>
          <OdsText class="block" preset={ODS_TEXT_PRESET.caption} slot="helper">
            {t('common:form_max_chars', {
              value: 12,
            })}
          </OdsText>
        </OdsFormField>
      </>
    </Modal>
  );
}
