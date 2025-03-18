import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useGenerateUrl, useOrganization } from '@/hooks';
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
import { OrganizationSchema, organizationSchema } from '@/utils';

export default function ModalAddAndEditOrganization() {
  const { t } = useTranslation(['organizations/form', 'common']);
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId, organizationId } = useParams();
  const trackingName = organizationId ? EDIT_ORGANIZATION : ADD_ORGANIZATION;
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl(organizationId ? '../..' : '..', 'path');
  const onClose = () => {
    navigate(goBackUrl);
  };

  const { data: organization } = useOrganization({ gcTime: 0 });

  const [isLoading, setIsLoading] = useState(organizationId && !organization);

  const { mutate: addOrEditOrganization, isPending: isSending } = useMutation({
    mutationFn: (params: OrganizationBodyParamsType) => {
      return organizationId
        ? putZimbraPlatformOrganization(platformId, organizationId, params)
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
            organizationId
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
            organizationId
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      name: organization?.currentState?.name || '',
      label: organization?.currentState?.label || '',
    },
    mode: 'onTouched',
    resolver: zodResolver(organizationSchema),
  });

  useEffect(() => {
    if (organization) {
      reset({
        name: organization?.currentState?.name,
        label: organization?.currentState?.label,
      });
      setIsLoading(false);
    }
  }, [organization, isLoading]);

  const handleSaveClick: SubmitHandler<OrganizationSchema> = (data) => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });
    addOrEditOrganization(data);
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

  return (
    <Modal
      isOpen
      title={
        organizationId
          ? t('common:edit_organization')
          : t('common:add_organization')
      }
      color={ODS_MODAL_COLOR.information}
      onClose={onClose}
      isDismissible
      isLoading={isLoading}
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleCancelClick,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        label: t('common:confirm'),
        isDisabled: !isDirty || !isValid,
        isLoading: isLoading || isSending,
        onClick: handleSubmit(handleSaveClick),
      }}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleSaveClick)}
      >
        {!organizationId && (
          <div>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_organization_add_modal_content_part1')}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_organization_add_modal_content_part2')}
            </OdsText>
          </div>
        )}
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t('common:form_mandatory_fields')}
        </OdsText>
        <Controller
          control={control}
          name="name"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField
              data-testid="field-name"
              error={errors?.[name]?.message}
              className="w-full"
            >
              <label htmlFor={name} slot="label">
                {t('zimbra_organization_add_form_input_name_title')} *
              </label>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                data-testid="input-name"
                placeholder={t(
                  'zimbra_organization_add_form_input_name_placeholder',
                )}
                id={name}
                name={name}
                hasError={!!errors[name]}
                value={value}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              ></OdsInput>
            </OdsFormField>
          )}
        />
        <Controller
          control={control}
          name="label"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField
              data-testid="field-label"
              error={errors?.[name]?.message}
              className="w-full"
            >
              <label htmlFor={name} slot="label">
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
                placeholder={t(
                  'zimbra_organization_add_form_input_label_placeholder',
                )}
                id={name}
                name={name}
                hasError={!!errors[name]}
                value={value}
                onOdsBlur={onBlur}
                onOdsChange={onChange}
              ></OdsInput>
            </OdsFormField>
          )}
        />
      </form>
    </Modal>
  );
}
