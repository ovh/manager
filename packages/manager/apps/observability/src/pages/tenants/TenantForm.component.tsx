import React from 'react';

import { useNavigate } from 'react-router-dom';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, Button, useNotifications } from '@ovh-ux/muk';

import { InformationForm } from '@/components/form/information-form/InformationForm.component';
import RegionSelector from '@/components/infrastructures/region-selector/RegionSelector.component';
import { TenantConfigurationForm } from '@/components/metrics/tenant-configuration-form/TenantConfigurationForm.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useCreateTenants } from '@/data/hooks/tenants/useCreateTenants.hook';
import { useTenantsFormSchema } from '@/hooks/form/useTenantsFormSchema.hook';
import { TenantFormLayout } from '@/pages/tenants/TenantForm.layout';
import { urls } from '@/routes/Routes.constants';
import type { TenantFormData } from '@/types/tenants.type';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export const TenantForm = () => {
  const { t } = useTranslation(['tenants', NAMESPACES.ACTIONS, NAMESPACES.ERROR]);
  const { selectedService } = useObservabilityServiceContext();
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();

  const { form } = useTenantsFormSchema();

  const goBack = () => {
    navigate(urls.tenants);
  };

  const { mutate: createTenant, isPending } = useCreateTenants({
    onSuccess: () => {
      addSuccess(t('tenants:creation.success'));
      goBack();
    },
    onError: (error) => {
      const { message } = error;
      addError(t(`${NAMESPACES.ERROR}:error_message`, { message }));
    },
  });

  const handleSubmit = (data: TenantFormData) => {
    if (!selectedService) return;

    const formData = {
      resourceName: selectedService.id,
      targetSpec: {
        title: data.title,
        description: data.description,
        infrastructure: {
          id: data.infrastructureId,
        },
        limits: {
          mimir: {
            compactor_blocks_retention_period: `${data.retentionDuration}${data.retentionUnit}`,
            max_global_series_per_user: data.maxSeries,
          },
        },
      },
    };

    createTenant(formData);
  };

  return (
    <TenantFormLayout>
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(handleSubmit)(e);
          }}
        >
          <section className="mt-6">
            <RegionSelector />
          </section>
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
            <TenantConfigurationForm />
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
              id="create-tenant"
              type="submit"
              size={BUTTON_SIZE.sm}
              color={BUTTON_COLOR.primary}
              disabled={!selectedService || isPending || !form.formState.isValid}
              loading={isPending}
              iamActions={IAM_ACTIONS.CREATE_TENANT}
              urn={selectedService?.iam?.urn}
              isIamTrigger={true}
            >
              {t(`${NAMESPACES.ACTIONS}:create`)}
            </Button>
          </section>
        </form>
      </FormProvider>
    </TenantFormLayout>
  );
};
