import React, { useContext, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  Button,
  FormField,
  FormFieldError,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';

import { Loading } from '@/components';
import {
  OrganizationBodyParamsType,
  OrganizationType,
  getZimbraPlatformOrganizationQueryKey,
  postZimbraPlatformOrganization,
} from '@/data/api';
import { useOrganizations } from '@/data/hooks';
import queryClient from '@/queryClient';
import { CONFIRM, ONBOARDING_CONFIGURE_ORGANIZATION } from '@/tracking.constants';
import { SimpleOrganizationSchema, simpleOrganizationSchema } from '@/utils';

export const ConfigureOrganization: React.FC = () => {
  const { t } = useTranslation(['onboarding', 'organizations/form', 'common', NAMESPACES.ACTIONS]);
  const { trackClick, trackPage } = useOvhTracking();
  const { addError } = useNotifications();
  const { platformId } = useParams();
  const navigate = useNavigate();
  const { data: organizations, isLoading } = useOrganizations({ gcTime: 0 });
  const context = useContext(ShellContext);
  const user = context.environment.getUser();
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
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      name: user?.organisation ?? user?.name ?? '',
    },
    mode: 'onChange',
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
        <Text preset={TEXT_PRESET.paragraph}>
          {t('organizations/form:zimbra_organization_add_error_message', {
            error: error.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSuccess: async (org: OrganizationType) => {
      await queryClient.invalidateQueries({
        queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
      });
      next(org?.id);
    },
  });

  const handleConfirmClick: SubmitHandler<SimpleOrganizationSchema> = (data) => {
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
      className="flex w-full flex-col gap-4 md:w-1/2"
      onSubmit={handleSubmit(handleConfirmClick)}
    >
      <Text preset={TEXT_PRESET.heading4}>{t('common:add_organization')}</Text>
      <Text preset={TEXT_PRESET.paragraph}>
        {t('organizations/form:zimbra_organization_add_modal_content_part1')}
      </Text>
      <Text preset={TEXT_PRESET.paragraph}>
        {t('organizations/form:zimbra_organization_add_modal_content_part2')}
      </Text>
      <Controller
        control={control}
        name="name"
        defaultValue={user?.organisation ?? user?.name ?? ''}
        render={({
          field: { name, value, onChange, onBlur },
          fieldState: { isDirty, isTouched },
        }) => (
          <FormField
            data-testid="field-name"
            invalid={(isDirty || isTouched) && !!errors?.[name]}
            className="w-full"
          >
            <FormFieldLabel>
              {t('organizations/form:zimbra_organization_add_form_input_name_title')}
              {' *'}
            </FormFieldLabel>
            <Input
              type={INPUT_TYPE.text}
              data-testid="input-name"
              placeholder={t(
                'organizations/form:zimbra_organization_add_form_input_name_placeholder',
              )}
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
      <Button
        className="self-start"
        data-testid="add-organization-submit-btn"
        type="submit"
        color={BUTTON_COLOR.primary}
        disabled={!isValid}
        loading={isSending}
      >
        {`${t(`${NAMESPACES.ACTIONS}:next`)} 1/3`}
      </Button>
    </form>
  );
};

export default ConfigureOrganization;
