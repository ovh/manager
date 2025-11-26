import { useEffect, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Drawer } from '@ovh-ux/muk';

import { useEditTenant } from '@/data/hooks/tenants/useEditTenant.hook';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import { useTenantsFormSchema } from '@/hooks/form/useTenantsFormSchema.hook';
import { TenantsFormLayout } from '@/pages/tenants/TenantsForm.layout';
import { TenantFormData } from '@/types/tenants.type';
import { INGESTION_BOUNDS } from '@/utils/tenants.constants';

import { InformationForm } from '../form/information-form/InformationForm.component';
import { TenantConfigurationForm } from '../metrics/tenant-configuration-form/TenantConfigurationForm.component';
import { EditTenantDrawerProps } from './EditTenant.props';

const EditTenantDrawer = ({ tenantId, resourceName }: EditTenantDrawerProps) => {
  const { t } = useTranslation(['tenants', NAMESPACES.ACTIONS]);

  const navigate = useNavigate();

  const { data: tenant, isLoading: isTenantLoading } = useTenant(resourceName, tenantId);

  const initialValues = useMemo<Partial<TenantFormData>>(() => {
    if (!tenant) {
      return {};
    }

    const tenantState = tenant.currentState;
    const limits = tenantState?.limits;

    return {
      title: tenantState?.title ?? '',
      description: tenantState?.description ?? '',
      infrastructureId: tenantState?.infrastructure?.id ?? '',
      retentionId: limits?.retention?.id ?? '',
      maxSeries:
        limits?.numberOfSeries?.maximum ??
        limits?.numberOfSeries?.current ??
        INGESTION_BOUNDS.DEFAULT,
    };
  }, [tenant]);

  const { form } = useTenantsFormSchema();

  useEffect(() => {
    if (tenant && initialValues && Object.keys(initialValues).length > 0) {
      form.reset(initialValues);
    }
  }, [tenant, tenant?.id, initialValues, form]);

  const { mutate: editTenant, isPending } = useEditTenant({
    onSuccess: (updatedTenant) => {
      // TODO: Add notification
      console.info('Tenant updated:', updatedTenant);
      handleDismiss();
    },
    onError: (error) => {
      // TODO: Handle error (show notification, etc.)
      console.error('Failed to update tenant:', error);
    },
  });

  const handleSubmit = (data: TenantFormData) => {
    const formData = {
      resourceName,
      tenantId,
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

    editTenant(formData);
  };

  const handleDismiss = () => {
    navigate(-1);
  };

  return (
    <FormProvider key={tenant?.id} {...form}>
      <Drawer.Root isLoading={isTenantLoading} onDismiss={handleDismiss}>
        <Drawer.Header title={t('tenants:edition.title')} />

        <Drawer.Content>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('tenants:edition.subtitle', {
              tenantName: tenant?.currentState?.title,
            })}
          </Text>
          <TenantsFormLayout>
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
          </TenantsFormLayout>
        </Drawer.Content>

        <Drawer.Footer
          primaryButton={{
            label: t(`${NAMESPACES.ACTIONS}:save`),
            isDisabled: !tenant || isTenantLoading || isPending || !form.formState.isValid,
            isLoading: isPending,
            onClick: () => void form.handleSubmit(handleSubmit)(),
          }}
          secondaryButton={{
            label: t(`${NAMESPACES.ACTIONS}:cancel`),
            onClick: handleDismiss,
          }}
        />
      </Drawer.Root>
    </FormProvider>
  );
};

export default EditTenantDrawer;
