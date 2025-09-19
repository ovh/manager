import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import {
  Notifications,
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  useCatalog,
  useParam as useSafeParams,
} from '@ovh-ux/manager-pci-common';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNewPoolStore } from '@/pages/detail/nodepools/new/store';
import { StepsEnum } from '@/pages/detail/nodepools/new/steps.enum';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { createNodePool } from '@/api/data/node-pools';
import BillingStep, {
  TBillingStepProps,
} from '@/components/create/BillingStep.component';
import queryClient from '@/queryClient';
import { useTrack } from '@/hooks/track';
import NodePoolAntiAffinity from '@/pages/new/steps/node-pool/NodePoolAntiAffinity.component';
import { FlavorSelector } from '@/components/flavor-selector/FlavorSelector.component';
import NodePoolSize from '@/pages/new/steps/node-pool/NodePoolSize.component';
import DeploymentZone from '@/pages/new/steps/node-pool/DeploymentZone.component';
import { isMultiDeploymentZones } from '@/helpers';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import useMergedFlavorById, {
  getPriceByDesiredScale,
} from '@/hooks/useMergedFlavorById';
import { hasInvalidScalingOrAntiAffinityConfig } from '@/helpers/node-pool';
import { TCreateNodePoolParam } from '@/types';

export default function NewPage(): JSX.Element {
  const { t } = useTranslation([
    'common',
    'listing',
    'add',
    'add-form',
    'kube',
    'node-pool',
  ]);

  const { trackClick } = useTrack();

  const store = useNewPoolStore();

  const { projectId, kubeId: clusterId } = useSafeParams('projectId', 'kubeId');
  const { data: catalog, isPending: isCatalogPending } = useCatalog();
  const { data: cluster, isPending: isClusterPending } = useKubernetesCluster(
    projectId,
    clusterId,
  );

  const navigate = useNavigate();

  const { addError, addSuccess } = useNotifications();

  const [state, setState] = useState({
    isAdding: false,
  });

  const { data: regionInformations } = useRegionInformations(
    projectId,
    cluster?.region ?? null,
  );

  const [billingState, setBillingState] = useState<
    TBillingStepProps & {
      antiAffinity: {
        isEnabled: boolean;
        isChecked: boolean;
        onChange: (val: boolean) => void;
      };
    }
  >({
    antiAffinity: {
      isEnabled: false,
      isChecked: false,
      onChange: (val: boolean) => {
        setBillingState((prev) => ({
          ...prev,
          antiAffinity: { ...prev.antiAffinity, isChecked: val },
        }));
        store.set.antiAffinity(val);
      },
    },
    price: 0,
    monthlyPrice: undefined,
    monthlyBilling: {
      isComingSoon: false,
      isChecked: false,
      check: (val: boolean) => {
        setBillingState((prev) => ({
          ...prev,
          monthlyBilling: { ...prev.monthlyBilling, isChecked: val },
        }));
        store.set.isMonthlyBilling(val);
      },
    },
    warn: false,
  });

  const price = useMergedFlavorById(
    projectId,
    cluster?.region ?? null,
    store.flavor?.id,
    {
      select: (flavor) =>
        getPriceByDesiredScale(
          flavor?.pricingsHourly?.price,
          flavor?.pricingsMonthly?.price,
          store.scaling?.quantity.desired,
        ),
    },
  );

  // reset store on mount
  useEffect(() => {
    store.reset();
  }, []);

  // set billing state
  useEffect(() => {
    if (store.flavor && !isCatalogPending) {
      const monthlyBillingState = (() => {
        if (store.flavor) {
          const addon = catalog?.addons.find(
            (add) => add.planCode === store.flavor?.planCodes?.hourly,
          );
          return addon?.blobs?.tags?.includes('coming_soon')
            ? 'coming_soon'
            : 'not_available';
        }
        return 'available';
      })();

      const warnForAutoscaleBilling = Boolean(
        store.isMonthlyBilling && store.scaling?.isAutoscale,
      );

      setBillingState((prev) => ({
        ...prev,
        warn: warnForAutoscaleBilling,
        price: store.flavor?.pricingsHourly?.price ?? 0,
        monthlyPrice: store.flavor?.pricingsMonthly?.price ?? 0,
        monthlyBilling: {
          ...prev.monthlyBilling,
          isComingSoon: monthlyBillingState === 'coming_soon',
        },
      }));
    }
  }, [store.flavor, store.isMonthlyBilling, store.scaling, isCatalogPending]);

  const create = () => {
    trackClick(`details::nodepools::add::confirm`);

    setState((prev) => ({
      ...prev,
      isAdding: true,
    }));

    const param: TCreateNodePoolParam = {
      flavorName: store.flavor?.name || '',
      ...(store.selectedAvailabilityZone && {
        availabilityZones: [store.selectedAvailabilityZone],
      }),
      name: store.name.value,
      antiAffinity: store.antiAffinity,
      monthlyBilled: store.isMonthlyBilling,
      autoscale: Boolean(store.scaling?.isAutoscale),
      ...(Boolean(store.scaling?.isAutoscale) && {
        minNodes: store.scaling?.quantity.min ?? 0,
        maxNodes: store.scaling.quantity.max,
      }),
      desiredNodes: store.scaling?.quantity.desired ?? 0,
    };
    createNodePool(projectId, clusterId, param)
      .then(() => {
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

        queryClient.invalidateQueries({
          queryKey: [
            'project',
            projectId,
            'kubernetes',
            clusterId,
            'nodePools',
          ],
        });
        navigate('../nodepools');
      })
      .catch((e) => {
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
      })
      .finally(() => {
        setState((prev) => ({
          ...prev,
          isAdding: false,
        }));
      });
  };

  const handleValueChange = (e: OdsInputValueChangeEvent) => {
    if (e.detail.value) store.set.name(e.detail.value);
  };

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

      <div ref={store.steps.get(StepsEnum.NAME)?.ref}></div>
      <StepComponent
        id={StepsEnum.NAME}
        order={1}
        title={t('add:kube_add_name_title')}
        isOpen={!!store.steps.get(StepsEnum.NAME)?.isOpen}
        isChecked={!!store.steps.get(StepsEnum.NAME)?.isChecked}
        isLocked={!!store.steps.get(StepsEnum.NAME)?.isLocked}
        next={{
          isDisabled: !store.name.isTouched || !!store.name.hasError,
          action: () => {
            if (store.name.isTouched && !store.name.hasError) {
              store.check(StepsEnum.NAME);
              store.lock(StepsEnum.NAME);
              store.open(StepsEnum.TYPE);
            }
          },
          label: t('common_stepper_next_button_label'),
        }}
        edit={{
          action: () => {
            store.edit(StepsEnum.NAME);
          },
          label: t('common_stepper_modify_this_step'),
        }}
      >
        <OsdsFormField
          data-testid="name-field"
          className="mt-4"
          inline
          error={
            store.name.hasError
              ? t('add:kube_add_node_pool_name_input_pattern_validation_error')
              : ''
          }
        >
          <OsdsText
            slot="label"
            color={
              store.name.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.text
            }
            className="mt-4"
            size={ODS_TEXT_SIZE._100}
          >
            {t('add:kubernetes_add_name')}
          </OsdsText>
          <div className="w-fit">
            <OsdsInput
              data-testid="name-input"
              value={store.name.value}
              inline
              color={
                store.name.hasError
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              onOdsValueChange={handleValueChange}
              type={ODS_INPUT_TYPE.text}
              error={store.name.hasError}
              className="border"
            />
          </div>
        </OsdsFormField>
      </StepComponent>
      <div ref={store.steps.get(StepsEnum.TYPE)?.ref}></div>
      <StepComponent
        id={StepsEnum.TYPE}
        title={t('add-form:kube_common_node_pool_model_type_selector')}
        isOpen={Boolean(store.steps.get(StepsEnum.TYPE)?.isOpen)}
        isChecked={Boolean(store.steps.get(StepsEnum.TYPE)?.isChecked)}
        isLocked={Boolean(store.steps.get(StepsEnum.TYPE)?.isLocked)}
        order={2}
        next={{
          isDisabled: !store.flavor,
          action: () => {
            if (store.flavor) {
              store.check(StepsEnum.TYPE);
              store.lock(StepsEnum.TYPE);
              store.open(StepsEnum.SIZE);
            }
          },
          label: t('common_stepper_next_button_label'),
        }}
        edit={{
          action: () => {
            store.edit(StepsEnum.TYPE);
          },
          label: t('common_stepper_modify_this_step'),
        }}
      >
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        >
          {t('add-form:kubernetes_add_node_pool_description')}
        </OsdsText>
        <br />
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        >
          {t('add-form:kubernetes_add_node_pool_node_type')}
        </OsdsText>
        <>
          {!isClusterPending && cluster?.region && (
            <FlavorSelector
              projectId={projectId}
              region={cluster?.region}
              onSelect={(flavor) => {
                store.set.flavor(flavor);
              }}
            />
          )}
        </>
      </StepComponent>
      <div ref={store.steps.get(StepsEnum.SIZE)?.ref}></div>
      <StepComponent
        id={StepsEnum.SIZE}
        title={t('node-pool:kube_node_pool')}
        isOpen={Boolean(store.steps.get(StepsEnum.SIZE)?.isOpen)}
        isChecked={Boolean(store.steps.get(StepsEnum.SIZE)?.isChecked)}
        isLocked={Boolean(store.steps.get(StepsEnum.SIZE)?.isLocked)}
        order={3}
        next={{
          action: () => {
            if (store.scaling) {
              store.check(StepsEnum.SIZE);
              store.lock(StepsEnum.SIZE);
              store.open(StepsEnum.BILLING);
            }
          },
          label: t('common_stepper_next_button_label'),
          isDisabled: !!(
            regionInformations &&
            hasInvalidScalingOrAntiAffinityConfig(regionInformations, {
              name: store.name.value,
              isTouched: store.name.isTouched,
              scaling: store.scaling,
              antiAffinity: store.antiAffinity,
              selectedAvailabilityZone: store.selectedAvailabilityZone,
            })
          ),
        }}
        edit={{
          action: () => {
            store.edit(StepsEnum.SIZE);
          },
          label: t('common_stepper_modify_this_step'),
        }}
      >
        {regionInformations?.type &&
        isMultiDeploymentZones(regionInformations.type) ? (
          <div className="mb-8 flex gap-4">
            <DeploymentZone
              onSelect={store.set.selectedAvailabilityZone}
              availabilityZones={regionInformations?.availabilityZones}
              selectedAvailabilityZone={store.selectedAvailabilityZone}
            />
          </div>
        ) : (
          <div />
        )}
        <NodePoolSize
          isMonthlyBilled={store.isMonthlyBilling}
          onScaleChange={(auto) => store.set.scaling(auto)}
          antiAffinity={billingState.antiAffinity.isChecked}
        />
        <NodePoolAntiAffinity
          isChecked={billingState.antiAffinity.isChecked}
          isEnabled={!store.scaling?.isAutoscale}
          onChange={billingState.antiAffinity.onChange}
        />
      </StepComponent>
      <div ref={store.steps.get(StepsEnum.BILLING)?.ref}></div>
      <StepComponent
        id={StepsEnum.BILLING}
        title={t('kube:kube_service_billing')}
        isOpen={Boolean(store.steps.get(StepsEnum.BILLING)?.isOpen)}
        isChecked={Boolean(store.steps.get(StepsEnum.BILLING)?.isChecked)}
        isLocked={Boolean(store.steps.get(StepsEnum.BILLING)?.isLocked)}
        order={4}
      >
        <BillingStep
          price={price?.hour ?? 0}
          monthlyPrice={price?.month}
          monthlyBilling={billingState.monthlyBilling}
          warn={billingState.warn}
        />

        {!state.isAdding ? (
          <div className="flex mt-4">
            <OsdsButton
              onClick={create}
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {t('listing:kube_common_save')}
            </OsdsButton>
            <OsdsButton
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.ghost}
              className="ml-4"
              onClick={() => {
                trackClick(`details::nodepools::add::cancel`);
                navigate('../nodepools');
              }}
            >
              {t('common_stepper_cancel_button_label')}
            </OsdsButton>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <OsdsSpinner inline />
            <OsdsText
              slot="label"
              color={ODS_THEME_COLOR_INTENT.text}
              className="mt-4"
              size={ODS_TEXT_SIZE._100}
            >
              {t('add:kube_add_node_pool_creating')}
            </OsdsText>
          </div>
        )}
      </StepComponent>
    </>
  );
}
