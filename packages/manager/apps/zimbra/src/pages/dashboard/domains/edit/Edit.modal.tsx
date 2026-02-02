import React, { useEffect, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  MODAL_COLOR,
  Select,
  SelectContent,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, SelectControl, useNotifications } from '@ovh-ux/muk';

import { getZimbraPlatformDomainQueryKey, putZimbraDomain } from '@/data/api';
import { useDomain, useOrganizations } from '@/data/hooks';
import { useGenerateUrl, useOdsModalOverflowHack } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, EDIT_DOMAIN } from '@/tracking.constants';
import { EditDomainSchema, editDomainSchema } from '@/utils';

export const EditDomainModal = () => {
  const { t } = useTranslation(['domains', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId, domainId } = useParams();

  // @TODO refactor when ods modal overflow is fixed
  const modalRef = useRef<HTMLDivElement>(undefined);
  useOdsModalOverflowHack(modalRef as any);

  const { data: domain, isLoading: isLoadingDomain } = useDomain({
    domainId,
    gcTime: 0,
  });
  const { data: organizations, isLoading: isLoadingOrganizations } = useOrganizations({
    shouldFetchAll: true,
  });

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('../..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: editDomain, isPending: isSending } = useMutation({
    mutationFn: (payload: EditDomainSchema) =>
      putZimbraDomain(platformId, payload.domainId, {
        organizationId: payload.organizationId,
      }),
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: EDIT_DOMAIN,
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('common:edit_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: EDIT_DOMAIN,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('common:edit_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getZimbraPlatformDomainQueryKey(platformId, domain?.id),
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
      domainId,
      organizationId: domain?.currentState?.organizationId || '',
    },
    mode: 'onTouched',
    resolver: zodResolver(editDomainSchema),
  });

  useEffect(() => {
    if (domain) {
      reset({
        domainId,
        organizationId: domain?.currentState?.organizationId,
      });
    }
  }, [domain]);

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EDIT_DOMAIN, CANCEL],
    });
    onClose();
  };

  const handleConfirmClick: SubmitHandler<EditDomainSchema> = (data) => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EDIT_DOMAIN, CONFIRM],
    });
    editDomain(data);
  };

  return (
    <Modal
      heading={t('common:edit_domain')}
      type={MODAL_COLOR.information}
      onOpenChange={onClose}
      open
      loading={isLoadingDomain || isLoadingOrganizations}
      ref={modalRef}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        testId: 'edit-btn',
        loading: isSending,
        disabled: !isDirty || !isValid,
        onClick: handleSubmit(handleConfirmClick),
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        testId: 'cancel-btn',
        onClick: handleCancelClick,
      }}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleConfirmClick)}>
        <FormField>
          <FormFieldLabel htmlFor="domain" slot="label">
            {t('common:domain')} *
          </FormFieldLabel>
          <Input
            type={INPUT_TYPE.text}
            disabled
            id="domain"
            name="domain"
            value={domain?.currentState?.name}
            data-testid="input-domain"
          />
        </FormField>
        <Controller
          control={control}
          name="organizationId"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField invalid={(isDirty || isTouched) && !!errors?.[name]}>
              <FormFieldLabel htmlFor={name} slot="label">
                {t('common:organization')} *
              </FormFieldLabel>
              <Select
                key={value}
                items={organizations?.map((organization) => ({
                  label: organization?.currentState?.label,
                  value: organization.id,
                }))}
                id={name}
                name={name}
                invalid={(isDirty || isTouched) && !!errors[name]}
                value={[value || domain?.currentState?.organizationId]}
                onValueChange={(detail) => onChange(detail.value[0])}
                onBlur={onBlur}
                data-testid="select-organization"
              >
                <SelectControl />
                <SelectContent />
              </Select>
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

export default EditDomainModal;
