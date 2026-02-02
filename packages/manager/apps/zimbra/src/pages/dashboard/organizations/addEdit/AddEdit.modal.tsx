import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  MODAL_COLOR,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

import {
  OrganizationBodyParamsType,
  getZimbraPlatformOrganizationDetailsQueryKey,
  getZimbraPlatformOrganizationQueryKey,
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/data/api';
import { useOrganization } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { ADD_ORGANIZATION, CANCEL, CONFIRM, EDIT_ORGANIZATION } from '@/tracking.constants';
import { OrganizationSchema, organizationSchema } from '@/utils';

export const AddEditOrganizationModal = () => {
  const { t } = useTranslation([
    'organizations/form',
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
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
        <Text preset={TEXT_PRESET.paragraph}>
          {t(
            organizationId
              ? 'common:edit_success_message'
              : 'zimbra_organization_add_success_message',
          )}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(
            organizationId ? 'common:edit_error_message' : 'zimbra_organization_add_error_message',
            {
              error: error.response?.data?.message,
            },
          )}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: organizationId
          ? getZimbraPlatformOrganizationDetailsQueryKey(platformId, organizationId)
          : getZimbraPlatformOrganizationQueryKey(platformId),
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
      heading={organizationId ? t('common:edit_organization') : t('common:add_organization')}
      open
      type={MODAL_COLOR.information}
      onOpenChange={onClose}
      loading={isLoading}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        testId: 'confirm-btn',
        disabled: !isDirty || !isValid,
        loading: isLoading || isSending,
        onClick: handleSubmit(handleSaveClick),
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
      }}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSaveClick)}>
        {!organizationId && (
          <div>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('zimbra_organization_add_modal_content_part1')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('zimbra_organization_add_modal_content_part2')}
            </Text>
          </div>
        )}
        <Text preset={TEXT_PRESET.caption}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</Text>
        <Controller
          control={control}
          name="name"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              data-testid="field-name"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
              className="w-full"
            >
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_organization_add_form_input_name_title')} *
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                data-testid="input-name"
                placeholder={t('zimbra_organization_add_form_input_name_placeholder')}
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors[name]}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
        <Controller
          control={control}
          name="label"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField
              data-testid="field-label"
              invalid={(isDirty || isTouched) && !!errors?.[name]}
              className="w-full"
            >
              <FormFieldLabel htmlFor={name} slot="label">
                {t('zimbra_organization_add_form_input_label_title')} *
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon className="ml-3 text-xs" name={ICON_NAME.circleQuestion} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text preset={TEXT_PRESET.paragraph}>
                      {t('zimbra_organization_add_form_input_label_tooltip')}
                    </Text>
                  </TooltipContent>
                </Tooltip>
              </FormFieldLabel>
              <Input
                type={INPUT_TYPE.text}
                data-testid="input-label"
                placeholder={t('zimbra_organization_add_form_input_label_placeholder')}
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors[name]}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      </form>
    </Modal>
  );
};

export default AddEditOrganizationModal;
