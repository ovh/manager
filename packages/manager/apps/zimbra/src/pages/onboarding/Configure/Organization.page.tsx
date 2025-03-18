import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useOrganizations } from '@/hooks';
import { SimpleOrganizationSchema, simpleOrganizationSchema } from '@/utils';
import {
  CONFIRM,
  ONBOARDING_CONFIGURE_ORGANIZATION,
} from '@/tracking.constant';
import {
  getZimbraPlatformOrganizationQueryKey,
  OrganizationBodyParamsType,
  postZimbraPlatformOrganization,
} from '@/api/organization';
import queryClient from '@/queryClient';
import Loading from '@/components/Loading/Loading';

export const ConfigureOrganization: React.FC = () => {
  const { t } = useTranslation(['onboarding', 'organizations/form', 'common']);
  const { trackClick, trackPage } = useOvhTracking();
  const { addError } = useNotifications();
  const { platformId } = useParams();
  const navigate = useNavigate();
  const { data: organizations, isLoading } = useOrganizations({ gcTime: 0 });
  const next = (organizationId: string) => {
    navigate(`../domain?organization=${organizationId}`);
  };

  useEffect(() => {
    if (organizations?.length) {
      next(organizations[organizations.length - 1].id);
    }
  }, [organizations]);

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onTouched',
    resolver: zodResolver(simpleOrganizationSchema),
  });

  const { mutate: addOrganization, isPending: isSending } = useMutation({
    mutationFn: (params: OrganizationBodyParamsType) => {
      return postZimbraPlatformOrganization(platformId, params);
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: ONBOARDING_CONFIGURE_ORGANIZATION,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('organizations/form:zimbra_organization_add_error_message', {
            error: error.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSuccess: (org) => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
      });
      next(org?.id);
    },
  });

  const handleConfirmClick: SubmitHandler<SimpleOrganizationSchema> = (
    data,
  ) => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ONBOARDING_CONFIGURE_ORGANIZATION, CONFIRM],
    });
    addOrganization({ ...data, label: data.name.slice(0, 12) });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form
      className="flex flex-col gap-4 w-full md:w-1/2"
      onSubmit={handleSubmit(handleConfirmClick)}
    >
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('common:add_organization')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('organizations/form:zimbra_organization_add_modal_content_part1')}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('organizations/form:zimbra_organization_add_modal_content_part2')}
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
              {t(
                'organizations/form:zimbra_organization_add_form_input_name_title',
              )}
              {' *'}
            </label>
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              data-testid="input-name"
              placeholder={t(
                'organizations/form:zimbra_organization_add_form_input_name_placeholder',
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
      <OdsButton
        className="self-start"
        data-testid="add-organization-submit-btn"
        type="submit"
        color={ODS_BUTTON_COLOR.primary}
        isDisabled={!isDirty || !isValid}
        isLoading={isSending}
        label={`${t('common:next')} 1/3`}
      ></OdsButton>
    </form>
  );
};

export default ConfigureOrganization;
