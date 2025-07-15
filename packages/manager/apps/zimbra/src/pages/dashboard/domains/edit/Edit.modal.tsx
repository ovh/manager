import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDomain, useOrganizations } from '@/data/hooks';
import { useGenerateUrl, useOdsModalOverflowHack } from '@/hooks';
import { getZimbraPlatformDomainsQueryKey, putZimbraDomain } from '@/data/api';
import { Modal } from '@/components';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, EDIT_DOMAIN } from '@/tracking.constants';
import { EditDomainSchema, editDomainSchema } from '@/utils';

export const EditDomainModal = () => {
  const { t } = useTranslation(['domains', 'common']);
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId, domainId } = useParams();

  // @TODO refactor when ods modal overflow is fixed
  const modalRef = useRef<HTMLOdsModalElement>(undefined);
  useOdsModalOverflowHack(modalRef);

  const { data: domain, isLoading: isLoadingDomain } = useDomain({
    domainId,
    gcTime: 0,
  });
  const {
    data: organizations,
    isLoading: isLoadingOrganizations,
  } = useOrganizations({ shouldFetchAll: true });

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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:edit_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: EDIT_DOMAIN,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:edit_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformDomainsQueryKey(platformId),
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
      title={t('common:edit_domain')}
      color={ODS_MODAL_COLOR.information}
      onClose={onClose}
      isOpen
      isDismissible
      isLoading={isLoadingDomain || isLoadingOrganizations}
      ref={modalRef}
      primaryButton={{
        label: t('common:confirm'),
        onClick: handleSubmit(handleConfirmClick),
        isDisabled: !isDirty || !isValid,
        isLoading: isSending,
        testid: 'edit-btn',
      }}
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleCancelClick,
        testid: 'cancel-btn',
      }}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleConfirmClick)}
      >
        <OdsFormField>
          <label htmlFor="domain" slot="label">
            {t('common:domain')} *
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            isDisabled
            id="domain"
            name="domain"
            defaultValue={domain?.currentState?.name}
            value={domain?.currentState?.name}
            data-testid="input-domain"
          ></OdsInput>
        </OdsFormField>
        <Controller
          control={control}
          name="organizationId"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('common:organization')} *
              </label>
              <OdsSelect
                key={value}
                id={name}
                name={name}
                hasError={!!errors[name]}
                value={
                  value || domain?.currentState?.organizationId
                  /* necessary to prevent a bug where value is empty
                   * even after it has been updated by the domain org id
                   * in some random case */
                }
                onOdsChange={onChange}
                onOdsBlur={onBlur}
                data-testid="select-organization"
              >
                {organizations?.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.currentState.label}
                  </option>
                ))}
              </OdsSelect>
            </OdsFormField>
          )}
        />
      </form>
    </Modal>
  );
};

export default EditDomainModal;
