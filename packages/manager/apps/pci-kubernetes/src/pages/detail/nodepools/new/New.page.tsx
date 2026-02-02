import { ReactElement, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';

import { useParam as useSafeParams } from '@ovh-ux/manager-pci-common';
import { Notifications, StepComponent, useNotifications } from '@ovh-ux/manager-react-components';

import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { hasInvalidScalingOrAntiAffinityConfig } from '@/helpers/node-pool';
import { useTrack } from '@/hooks/track';
import useMergedFlavorById, { getPriceByDesiredScale } from '@/hooks/useMergedFlavorById';
import { useBillingState } from '@/pages/detail/nodepools/new/hooks/useBillingState';
import { useNodePoolCreation } from '@/pages/detail/nodepools/new/hooks/useNodePoolCreation';
import { StepsEnum } from '@/pages/detail/nodepools/new/steps.enum';
import { useNewPoolStore } from '@/pages/detail/nodepools/new/store';

import FinalBillingStep from './components/FinalBillingStep.component';
import NameStep from './components/NameStep.component';
import SizeStep from './components/SizeStep.component';
import TypeStep from './components/TypeStep.component';

export default function NewPage(): ReactElement {
  const { t } = useTranslation(['common', 'listing', 'add-form', 'node-pool', 'kube']);
  const { trackClick } = useTrack();
  const store = useNewPoolStore();
  const navigate = useNavigate();

  const { projectId, kubeId: clusterId } = useSafeParams('projectId', 'kubeId');
  const { data: cluster, isPending: isClusterPending } = useKubernetesCluster(projectId, clusterId);
  const { data: regionInformations } = useRegionInformations(projectId, cluster?.region ?? null);
  const { addError, addSuccess } = useNotifications();

  const price = useMergedFlavorById(projectId, cluster?.region ?? null, store.flavor?.id, {
    select: (flavor) =>
      getPriceByDesiredScale(
        flavor?.pricingsHourly?.price,
        flavor?.pricingsMonthly?.price,
        store.scaling?.quantity.desired,
      ),
  });

  const billingState = useBillingState({
    flavor: store.flavor,
    isMonthlyBilling: store.isMonthlyBilling,
    scaling: store.scaling,
    onAntiAffinityChange: store.set.antiAffinity,
  });

  const { create, isAdding } = useNodePoolCreation(projectId, clusterId, {
    onSuccess: () => {
      addSuccess(
        <Translation ns="add">
          {(_t) =>
            _t('kube_add_node_pool_success', {
              nodePoolName: store.name.value,
            })
          }
        </Translation>,
        true,
      );
      navigate('../nodepools');
    },
    onError: (e) => {
      addError(
        <Translation ns="add">
          {(_t) =>
            _t('kube_add_node_pool_error', {
              message: e?.response?.data?.message || e?.message || null,
              nodePoolName: store.name.value,
            })
          }
        </Translation>,
        true,
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  useEffect(() => {
    store.reset();
  }, [store.reset]);

  const handleNameChange = (e: OdsInputValueChangeEvent) => {
    if (e.detail.value) store.set.name(e.detail.value);
  };

  const handleCreateNodePool = () => {
    create(
      {
        name: store.name.value,
        flavor: store.flavor,
        antiAffinity: store.antiAffinity,
        ...(store.selectedAvailabilityZones && {
          selectedAvailabilityZones: store.selectedAvailabilityZones,
        }),
        ...(store.attachFloatingIps && { attachFloatingIps: store.attachFloatingIps }),
        isMonthlyBilling: store.isMonthlyBilling,
        scaling: store.scaling,
      },
      () => trackClick(`details::nodepools::add::confirm`),
    );
  };

  const handleCancel = () => {
    trackClick(`details::nodepools::add::cancel`);
    navigate('../nodepools');
  };

  const steps = useMemo(
    () => [
      {
        id: StepsEnum.NAME,
        title: t('add:kube_add_name_title'),
        condition: true,
        next: {
          action: () => {
            if (store.name.isTouched && !store.name.hasError) {
              store.check(StepsEnum.NAME);
              store.lock(StepsEnum.NAME);
              store.open(StepsEnum.TYPE);
            }
          },
          label: t('common_stepper_next_button_label'),
          isDisabled: !store.name.isTouched || !!store.name.hasError,
        },
        edit: {
          action: () => {
            store.edit(StepsEnum.NAME);
          },
          label: t('common_stepper_modify_this_step'),
        },
        render: () => <NameStep name={store.name} onNameChange={handleNameChange} />,
      },
      {
        id: StepsEnum.TYPE,
        title: t('add-form:kube_common_node_pool_model_type_selector'),
        condition: !isClusterPending && !!cluster?.region,
        next: {
          action: () => {
            if (store.flavor) {
              store.check(StepsEnum.TYPE);
              store.lock(StepsEnum.TYPE);
              store.open(StepsEnum.SIZE);
            }
          },
          label: t('common_stepper_next_button_label'),
          isDisabled: !store.flavor,
        },
        edit: {
          action: () => {
            store.edit(StepsEnum.TYPE);
          },
          label: t('common_stepper_modify_this_step'),
        },
        render: () => (
          <TypeStep
            projectId={projectId}
            region={cluster?.region ?? ''}
            onFlavorSelect={store.set.flavor}
          />
        ),
      },
      {
        id: StepsEnum.SIZE,
        title: t('node-pool:kube_node_pool'),
        condition: true,
        next: {
          action: () => {
            if (store.scaling) {
              store.check(StepsEnum.SIZE);
              store.lock(StepsEnum.SIZE);
              store.open(StepsEnum.BILLING);
            }
          },
          label: t('common_stepper_next_button_label'),
          isDisabled: !!(
            regionInformations?.type &&
            hasInvalidScalingOrAntiAffinityConfig({
              scaling: store.scaling,
              antiAffinity: billingState.antiAffinity.isChecked,
              selectedAvailabilityZones: store.selectedAvailabilityZones,
            })
          ),
        },
        edit: {
          action: () => {
            store.edit(StepsEnum.SIZE);
          },
          label: t('common_stepper_modify_this_step'),
        },
        render: () => (
          <SizeStep
            regionInformations={regionInformations}
            plan={cluster?.plan}
            selectedAvailabilityZones={store.selectedAvailabilityZones}
            antiAffinity={billingState.antiAffinity.isChecked}
            onAttachFloatingIPs={(enabled) => store.set.attachFloatingIps({ enabled })}
            onAntiAffinityChange={billingState.antiAffinity.onChange}
          />
        ),
      },
      {
        id: StepsEnum.BILLING,
        title: t('kube:kube_service_billing'),
        condition: true,
        render: () => (
          <FinalBillingStep
            isAdding={isAdding}
            price={price?.hour ?? 0}
            regionType={regionInformations?.type}
            monthlyPrice={price?.month}
            monthlyBilling={billingState.monthlyBilling}
            warn={billingState.warn}
            onCreate={handleCreateNodePool}
            onCancel={handleCancel}
          />
        ),
      },
    ],
    [
      store.name,
      store.flavor,
      store.scaling,
      store.selectedAvailabilityZones,
      isClusterPending,
      cluster?.region,
      projectId,
      regionInformations,
      billingState,
      isAdding,
      price,
      handleNameChange,
      handleCreateNodePool,
      handleCancel,
    ],
  );

  return (
    <>
      <Notifications />
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._700}
      >
        {t('listing:kube_common_create_node_pool')}
      </OsdsText>

      {steps.map((step) => {
        if (!step.condition) return null;

        const stepState = store.steps.get(step.id);
        const visibleSteps = steps.filter((s) => s.condition);
        const visibleIndex = visibleSteps.findIndex((s) => s.id === step.id);

        return (
          <StepComponent
            key={step.id}
            id={step.id}
            title={step.title}
            isOpen={!!stepState?.isOpen}
            isChecked={!!stepState?.isChecked}
            isLocked={!!stepState?.isLocked}
            order={visibleIndex + 1}
            {...(step.next && { next: step.next })}
            {...(step.edit && { edit: step.edit })}
          >
            {step.render()}
          </StepComponent>
        );
      })}
    </>
  );
}
