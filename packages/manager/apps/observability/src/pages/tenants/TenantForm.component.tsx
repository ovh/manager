import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { FormProvider, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, Button, useNotifications } from '@ovh-ux/muk';

import { InformationForm } from '@/components/form/information-form/InformationForm.component';
import RegionSelector from '@/components/infrastructures/region-selector/RegionSelector.component';
import { TenantConfigurationForm } from '@/components/metrics/tenant-configuration-form/TenantConfigurationForm.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useCreateTenants } from '@/data/hooks/tenants/useCreateTenants.hook';
import { useEditTenant } from '@/data/hooks/tenants/useEditTenant.hook';
import { useTenantsFormSchema } from '@/hooks/form/useTenantsFormSchema.hook';
import { TenantFormLayout } from '@/pages/tenants/TenantForm.layout';
import { TenantFormProps } from '@/pages/tenants/TenantForm.props';
import { urls } from '@/routes/Routes.constants';
import type { TenantFormData } from '@/types/tenants.type';
import {
  ObservabilityDurationParsed,
  parseObservabilityDurationValue,
} from '@/utils/duration.utils';
import { getErrorMessage } from '@/utils/error.utils';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export const TenantForm = ({ tenant }: TenantFormProps) => {
  const { t } = useTranslation(['tenants', NAMESPACES.ACTIONS, NAMESPACES.ERROR]);
  const { selectedService } = useObservabilityServiceContext();
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();

  const isEditionMode = tenant !== undefined;

  const { form } = useTenantsFormSchema();

  // Subscribe to form state changes
  const { isValid } = useFormState({ control: form.control });

  // Track bounds validation errors from TenantConfigurationForm
  const [hasBoundsError, setHasBoundsError] = useState(false);

  const goBack = () => {
    if (isEditionMode) {
      navigate(-1);
    } else {
      navigate(urls.tenants);
    }
  };

  const handleError = (error: unknown) => {
    const message = getErrorMessage(error);
    addError(t(`${NAMESPACES.ERROR}:error_message`, { message }));
  };

  const createMutation = useCreateTenants({
    onSuccess: () => {
      addSuccess(t('tenants:creation.success'));
      goBack();
    },
    onError: (error) => handleError(error),
  });

  const editMutation = useEditTenant({
    onSuccess: () => {
      addSuccess(t('tenants:edition.success'));
      goBack();
    },
    onError: (error) => handleError(error),
  });

  const { isPending } = isEditionMode ? editMutation : createMutation;

  const handleSubmit = useCallback(
    (data: TenantFormData) => {
      if (!selectedService) return;

      const targetSpec = {
        title: data.title,
        description: data.description,
        ...(!isEditionMode && {
          infrastructure: {
            id: data.infrastructureId,
          },
        }),
        limits: {
          mimir: {
            compactor_blocks_retention_period: `${data.retentionDuration}${data.retentionUnit}`,
            max_global_series_per_user: data.maxSeries,
          },
        },
      };

      if (isEditionMode && tenant?.id) {
        editMutation.mutate({
          resourceName: selectedService.id,
          tenantId: tenant.id,
          targetSpec,
        });
      } else {
        createMutation.mutate({
          resourceName: selectedService.id,
          targetSpec,
        });
      }
    },
    [selectedService, isEditionMode, tenant, editMutation, createMutation],
  );

  const initialValues = useMemo<Partial<TenantFormData>>(() => {
    if (!isEditionMode || !tenant) {
      return {};
    }

    const tenantState = tenant.currentState;
    const limits = tenantState?.limits;
    const mimirLimits = limits?.mimir;
    const compactorRetention = mimirLimits?.compactor_blocks_retention_period;

    const parsedRetentionPeriod: ObservabilityDurationParsed | undefined = compactorRetention
      ? parseObservabilityDurationValue(compactorRetention)
      : undefined;

    return {
      title: tenantState?.title ?? '',
      description: tenantState?.description ?? '',
      infrastructureId: tenantState?.infrastructure?.id ?? '',
      retentionDuration: parsedRetentionPeriod?.value?.toString(),
      retentionUnit: parsedRetentionPeriod?.unit?.toString(),
      maxSeries: mimirLimits?.max_global_series_per_user,
    };
  }, [isEditionMode, tenant]);

  useEffect(() => {
    if (isEditionMode && tenant && initialValues && Object.keys(initialValues).length > 0) {
      form.reset(initialValues);
    }
  }, [isEditionMode, tenant, initialValues, form]);

  return (
    <TenantFormLayout>
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(handleSubmit)(e);
          }}
        >
          {!isEditionMode && (
            <section className="mt-6">
              <RegionSelector />
            </section>
          )}
          <Divider spacing="24" />
          <section className="mt-6">
            <InformationForm
              title={t('tenants:creation.tenantInformation')}
              namePlaceholder={t('tenants:creation.namePlaceholder')}
              descriptionPlaceholder={t('tenants:creation.descriptionPlaceholder')}
            />
          </section>
          <Divider spacing="24" />
          <section className="mt-6">
            <TenantConfigurationForm onBoundsErrorChange={setHasBoundsError} />
          </section>
          <section className="mx-auto mt-10 flex flex-row justify-between gap-6">
            <Button
              id="cancel-tenant"
              variant={BUTTON_VARIANT.ghost}
              onClick={goBack}
              size={BUTTON_SIZE.sm}
              color={BUTTON_COLOR.neutral}
              disabled={isPending}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              id={isEditionMode ? 'edit-tenant' : 'create-tenant'}
              type="submit"
              size={BUTTON_SIZE.sm}
              color={BUTTON_COLOR.primary}
              disabled={!selectedService || isPending || !isValid || hasBoundsError}
              loading={isPending}
              iamActions={isEditionMode ? IAM_ACTIONS.EDIT_TENANT : IAM_ACTIONS.CREATE_TENANT}
              urn={selectedService?.iam?.urn}
              isIamTrigger={true}
            >
              {t(`${NAMESPACES.ACTIONS}:${isEditionMode ? 'save' : 'create'}`)}
            </Button>
          </section>
        </form>
      </FormProvider>
    </TenantFormLayout>
  );
};
