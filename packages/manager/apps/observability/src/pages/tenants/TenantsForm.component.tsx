import { useNavigate } from 'react-router-dom';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsDivider, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerButton } from '@ovh-ux/manager-react-components';

import { InformationForm } from '@/components/form/information-form/InformationForm.component';
import RegionSelector from '@/components/infrastructures/region-selector/RegionSelector.component';
import { TenantConfigurationForm } from '@/components/metrics/tenant-configuration-form/TenantConfigurationForm.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useCreateTenants } from '@/data/hooks/tenants/useCreateTenants.hook';
import { urls } from '@/routes/Routes.constants';
import type { TenantFormData } from '@/types/tenants.type';
import { IAM_ACTIONS } from '@/utils/iam.constants';
import { INGESTION_BOUNDS } from '@/utils/tenants.constants';

import { useTenantsFormSchema } from '../../hooks/form/useTenantsFormSchema.hook';
import { TenantsFormLayout } from './TenantsForm.layout';

export const TenantsForm = () => {
  const { t } = useTranslation(['tenants', NAMESPACES.ACTIONS]);
  const { selectedService } = useObservabilityServiceContext();
  const navigate = useNavigate();
  const { form } = useTenantsFormSchema();

  const goBack = () => {
    navigate(urls.tenants);
  };

  const { mutate: createTenant, isPending } = useCreateTenants({
    onSuccess: (tenant) => {
      // TODO: Add notification
      console.info('Tenant created:', tenant);
      // Navigate back to tenants list on successful creation
      goBack();
    },
    onError: (error) => {
      // TODO: Handle error (show notification, etc.)
      console.error('Failed to create tenant:', error);
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
          numberOfSeries: {
            maximum: data.maxSeries ?? INGESTION_BOUNDS.DEFAULT,
          },
          retention: {
            id: data.retentionId,
          },
        },
      },
    };

    createTenant(formData);
  };

  return (
    <TenantsFormLayout>
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(handleSubmit)(e);
          }}
        >
          <OdsText className="block mt-6" preset="heading-2">
            {t('tenants:creation.title')}
          </OdsText>
          <section className="mt-6">
            <RegionSelector />
          </section>
          <OdsDivider spacing="24" />
          <section className="mt-6">
            <InformationForm
              title={t('tenants:creation.tenantInformation')}
              namePlaceholder={t('tenants:creation.namePlaceholder')}
              descriptionPlaceholder={t('tenants:creation.descriptionPlaceholder')}
            />
          </section>
          <OdsDivider spacing="24" />
          <section className="mt-6">
            <TenantConfigurationForm />
          </section>
          <section className="flex flex-row gap-6 mt-10 mx-auto justify-between">
            <ManagerButton
              id="cancel-tenant"
              variant={ODS_BUTTON_VARIANT.ghost}
              label={t(`${NAMESPACES.ACTIONS}:cancel`)}
              onClick={goBack}
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_BUTTON_COLOR.neutral}
              isDisabled={isPending}
            />
            <ManagerButton
              id="create-tenant"
              label={t(`${NAMESPACES.ACTIONS}:create`)}
              type="submit"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_BUTTON_COLOR.primary}
              isDisabled={!selectedService || isPending || !form.formState.isValid}
              isLoading={isPending}
              iamActions={IAM_ACTIONS.CREATE_TENANT}
              urn={selectedService?.iam?.urn}
            />
          </section>
        </form>
      </FormProvider>
    </TenantsFormLayout>
  );
};
