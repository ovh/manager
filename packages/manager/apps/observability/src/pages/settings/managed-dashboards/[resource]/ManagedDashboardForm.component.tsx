import React, { useCallback, useEffect, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { FormProvider, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Divider } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, Button, useNotifications } from '@ovh-ux/muk';

import ErrorMessage from '@/components/error/ErrorMessage.component';
import { InformationForm } from '@/components/form/information-form/InformationForm.component';
import RegionSelector from '@/components/infrastructures/region-selector/RegionSelector.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useCreateGrafana } from '@/data/hooks/grafana/useCreateGrafana.hook';
import { useEditGrafana } from '@/data/hooks/grafana/useEditGrafana.hook';
import { useManagedDashboardFormSchema } from '@/hooks/form/useManagedDashboardFormSchema.hook';
import { MetricsFormLayout } from '@/pages/metrics/MetricsForm.layout';
import { ManagedDashboardFormProps } from '@/pages/settings/managed-dashboards/[resource]/ManagedDashboardForm.props';
import { GrafanaForm } from '@/pages/settings/managed-dashboards/[resource]/grafana/GrafanaForm.component';
import { urls } from '@/routes/Routes.constants';
import type { ManagedDashboardFormData } from '@/types/managedDashboards.type';
import { IAM_ACTIONS } from '@/utils/iam.constants';

export default function ManagedDashboardForm({ managedDashboard }: ManagedDashboardFormProps) {
  const { t } = useTranslation(['managed-dashboards', NAMESPACES.ACTIONS, NAMESPACES.ERROR]);
  const { selectedService } = useObservabilityServiceContext();
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();

  const { form } = useManagedDashboardFormSchema();
  const isEditionMode = managedDashboard !== undefined;

  // Subscribe to form state changes
  const { isValid } = useFormState({ control: form.control });

  const goBack = () => navigate(urls.managedDashboards);

  const onError = (error: Error) => addError(<ErrorMessage error={error} />);

  const createMutation = useCreateGrafana({
    onSuccess: () => {
      addSuccess(t('managed-dashboards:creation.success'));
      goBack();
    },
    onError: (error) => onError(error),
  });

  const editMutation = useEditGrafana({
    onSuccess: () => {
      addSuccess(t('managed-dashboards:edition.success'));
      goBack();
    },
    onError: (error) => onError(error),
  });

  const { isPending } = isEditionMode ? editMutation : createMutation;

  const handleSubmit = useCallback(
    (data: ManagedDashboardFormData) => {
      if (!selectedService) return;

      const targetSpec = {
        title: data.title,
        description: data.description,
        infrastructure: {
          id: data.infrastructureId,
        },
        datasource: {
          fullySynced: true,
        },
        release: {
          id: data.releaseId,
        },
        allowedNetworks: data.allowedNetworks,
      };

      if (isEditionMode && managedDashboard?.id) {
        editMutation.mutate({
          resourceName: selectedService.id,
          grafanaId: managedDashboard.id,
          targetSpec,
        });
      } else {
        createMutation.mutate({
          resourceName: selectedService.id,
          targetSpec,
        });
      }
    },
    [selectedService, isEditionMode, managedDashboard, editMutation, createMutation],
  );

  const initialValues = useMemo<Partial<ManagedDashboardFormData>>(() => {
    const state = managedDashboard?.currentState;
    if (!isEditionMode || !state) return {};
    return {
      title: state.title ?? '',
      description: state.description ?? '',
      infrastructureId: state.infrastructure?.id ?? '',
      allowedNetworks: state.allowedNetworks ?? [],
      releaseId: state.release?.id ?? '',
    };
  }, [isEditionMode, managedDashboard]);

  useEffect(() => {
    if (
      isEditionMode &&
      managedDashboard &&
      initialValues &&
      Object.keys(initialValues).length > 0
    ) {
      form.reset(initialValues);
    }
  }, [isEditionMode, managedDashboard, initialValues, form]);

  return (
    <MetricsFormLayout>
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit(handleSubmit)(e);
          }}
        >
          {!isEditionMode && (
            <>
              <section className="mt-6">
                <RegionSelector />
              </section>

              <Divider className="mb-12 mt-[30px]" />
            </>
          )}
          <section className="mt-6">
            <InformationForm
              title={t('managed-dashboards:creation.information')}
              namePlaceholder={t('managed-dashboards:creation.namePlaceholder')}
              descriptionPlaceholder={t('managed-dashboards:creation.descriptionPlaceholder')}
            />
          </section>
          <Divider className="mb-12 mt-[30px]" />
          <section className="mt-6">
            <GrafanaForm isCreation={!isEditionMode} />
          </section>
          <section className="mx-auto mt-10 flex flex-row justify-between gap-6">
            <Button
              id="cancel-managed-dashboard"
              variant={BUTTON_VARIANT.ghost}
              onClick={goBack}
              size={BUTTON_SIZE.sm}
              color={BUTTON_COLOR.neutral}
              disabled={isPending}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              id={`${isEditionMode ? 'edit' : 'create'}-managed-dashboard`}
              type="submit"
              size={BUTTON_SIZE.sm}
              color={BUTTON_COLOR.primary}
              disabled={!selectedService || isPending || !isValid}
              loading={isPending}
              iamActions={isEditionMode ? IAM_ACTIONS.EDIT_GRAFANA : IAM_ACTIONS.CREATE_GRAFANA}
              urn={isEditionMode ? managedDashboard.iam?.urn : selectedService?.iam?.urn}
            >
              {t(`${NAMESPACES.ACTIONS}:${isEditionMode ? 'save' : 'create'}`)}
            </Button>
          </section>
        </form>
      </FormProvider>
    </MetricsFormLayout>
  );
}
