import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
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
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNewPoolStore } from '@/pages/detail/nodepools/new/store';
import { StepsEnum } from '@/pages/detail/nodepools/new/steps.enum';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { createNodePool, TCreateNodePoolParam } from '@/api/data/node-pools';
import { useCatalog } from '@/api/hooks/catalog';
import BillingStep, {
  TBillingStepProps,
} from '@/components/create/BillingStep.component';
import { ANTI_AFFINITY_MAX_NODES, NODE_RANGE } from '@/constants';
import queryClient from '@/queryClient';
import { useTrack } from '@/hooks/track';
import NodePoolAntiAffinity from '@/pages/new/steps/node-pool/NodePoolAntiAffinity.component';
import { FlavorSelector } from '@/components/flavor-selector/FlavorSelector.component';
import NodePoolSize from '@/pages/new/steps/node-pool/NodePoolSize.component';
import DeploymentZone from '@/pages/new/steps/node-pool/DeploymentZone.component';
import { isMultiDeploymentZones } from '@/helpers';
import { useRegionInformations } from '@/api/hooks/useRegionInformations';

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

  const { projectId, kubeId: clusterId } = useParams();
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
    cluster?.region,
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
            (add) => add.planCode === store.flavor?.planCodes.hourly,
          );
          return addon?.blobs?.tags?.includes('coming_soon')
            ? 'coming_soon'
            : 'not_available';
        }
        return 'available';
      })();

      const warn = store.isMonthlyBilling && store.autoScaling.isAutoscale;

      const isAntiAffinityEnabled =
        !(
          !store.autoScaling?.isAutoscale &&
          store.autoScaling?.quantity.desired > ANTI_AFFINITY_MAX_NODES
        ) &&
        !(
          store.autoScaling?.isAutoscale &&
          store.autoScaling?.quantity.max > ANTI_AFFINITY_MAX_NODES
        );

      setBillingState((prev) => ({
        ...prev,
        warn,
        price: store.flavor?.pricingsHourly?.price || 0,
        monthlyPrice: store.flavor?.pricingsMonthly?.price,
        antiAffinity: {
          ...prev.antiAffinity,
          isEnabled: isAntiAffinityEnabled,
        },
        monthlyBilling: {
          ...prev.monthlyBilling,
          isComingSoon: monthlyBillingState === 'coming_soon',
        },
      }));
    }
  }, [
    store.flavor,
    store.isMonthlyBilling,
    store.autoScaling,
    isCatalogPending,
  ]);

  const create = () => {
    trackClick(`details::nodepools::add::confirm`);

    setState((prev) => ({
      ...prev,
      isAdding: true,
    }));

    const param: TCreateNodePoolParam = {
      flavorName: store.flavor?.name || '',
      name: store.name.value,
      antiAffinity: store.antiAffinity,
      monthlyBilled: store.isMonthlyBilling,
      autoscale: store.autoScaling.isAutoscale,
      minNodes: store.autoScaling.quantity.min,
      desiredNodes: store.autoScaling.isAutoscale
        ? store.autoScaling.quantity.min
        : store.autoScaling.quantity.desired,
      maxNodes: store.antiAffinity
        ? Math.min(ANTI_AFFINITY_MAX_NODES, store.autoScaling.quantity.max)
        : store.autoScaling.quantity.max,
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
          false,
        );
      })
      .finally(() => {
        setState((prev) => ({
          ...prev,
          isAdding: false,
        }));
      });
  };
  const hasMax5NodesAntiAffinity =
    !store.antiAffinity ||
    (store.antiAffinity &&
      store.autoScaling &&
      store.autoScaling.quantity.desired <= ANTI_AFFINITY_MAX_NODES);

  return (
    <>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._700}
      >
        {t('listing:kube_common_create_node_pool')}
      </OsdsText>

      <div ref={store.steps.get(StepsEnum.NAME).ref}></div>
      <StepComponent
        id={StepsEnum.NAME}
        order={1}
        title={t('add:kubernetes_add_name_title')}
        isOpen={store.steps.get(StepsEnum.NAME).isOpen}
        isChecked={store.steps.get(StepsEnum.NAME).isChecked}
        isLocked={store.steps.get(StepsEnum.NAME).isLocked}
        next={{
          action:
            store.name.isTouched && !store.name.hasError
              ? () => {
                  store.check(StepsEnum.NAME);
                  store.lock(StepsEnum.NAME);
                  store.open(StepsEnum.TYPE);
                }
              : undefined,
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
            {t('add:kube_add_node_pool_name_label')}
          </OsdsText>
          <OsdsInput
            data-testid="name-input"
            value={store.name.value}
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            onOdsValueChange={(e) => {
              store.set.name(e.detail.value);
            }}
            type={ODS_INPUT_TYPE.text}
            error={store.name.hasError}
            className="border"
          />
        </OsdsFormField>
      </StepComponent>
      <div ref={store.steps.get(StepsEnum.TYPE).ref}></div>
      <StepComponent
        id={StepsEnum.TYPE}
        title={t('add-form:kube_common_node_pool_model_type_selector')}
        isOpen={store.steps.get(StepsEnum.TYPE).isOpen}
        isChecked={store.steps.get(StepsEnum.TYPE).isChecked}
        isLocked={store.steps.get(StepsEnum.TYPE).isLocked}
        order={2}
        next={{
          action: store.flavor
            ? () => {
                store.check(StepsEnum.TYPE);
                store.lock(StepsEnum.TYPE);
                store.open(StepsEnum.SIZE);
              }
            : undefined,
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
        {!isClusterPending && (
          <>
            <FlavorSelector
              projectId={projectId}
              region={cluster.region}
              onSelect={(flavor) => {
                store.set.flavor(flavor);
              }}
            />
          </>
        )}
      </StepComponent>
      <div ref={store.steps.get(StepsEnum.SIZE).ref}></div>
      <StepComponent
        id={StepsEnum.SIZE}
        title={t('node-pool:kube_node_pool')}
        isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
        isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
        isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
        order={3}
        next={{
          action: store.autoScaling
            ? () => {
                store.check(StepsEnum.SIZE);
                store.lock(StepsEnum.SIZE);
                store.open(StepsEnum.BILLING);
              }
            : undefined,
          label: t('common_stepper_next_button_label'),
          isDisabled:
            !hasMax5NodesAntiAffinity ||
            !store.autoScaling ||
            (!store.autoScaling.isAutoscale &&
              store.autoScaling.quantity.desired > NODE_RANGE.MAX) ||
            (store.autoScaling.isAutoscale &&
              (store.autoScaling.quantity.min > NODE_RANGE.MAX ||
                store.autoScaling.quantity.max > NODE_RANGE.MAX ||
                store.autoScaling.quantity.min >=
                  store.autoScaling.quantity.max)),
        }}
        edit={{
          action: () => {
            store.edit(StepsEnum.SIZE);
          },
          label: t('common_stepper_modify_this_step'),
        }}
      >
        {isMultiDeploymentZones(regionInformations?.type) && (
          <div className="mb-8 flex gap-4">
            <DeploymentZone
              onSelect={store.set.selectedAvailibilityZone}
              availabilityZones={regionInformations?.availabilityZones}
              selectedAvailibilityZone={store.selectedAvailibilityZone}
            />
          </div>
        )}
        <NodePoolSize
          isMonthlyBilled={store.isMonthlyBilling}
          onScaleChange={(auto) => store.set.autoScaling(auto)}
          antiAffinity={billingState.antiAffinity.isChecked}
        />
        <NodePoolAntiAffinity
          isChecked={billingState.antiAffinity.isChecked}
          isEnabled={!store.autoScaling?.isAutoscale}
          onChange={billingState.antiAffinity.onChange}
        />
      </StepComponent>
      <div ref={store.steps.get(StepsEnum.BILLING).ref}></div>
      <StepComponent
        id={StepsEnum.BILLING}
        title={t('kube:kube_service_billing')}
        isOpen={store.steps.get(StepsEnum.BILLING).isOpen}
        isChecked={store.steps.get(StepsEnum.BILLING).isChecked}
        isLocked={store.steps.get(StepsEnum.BILLING).isLocked}
        order={4}
      >
        <BillingStep
          price={billingState.price}
          monthlyPrice={billingState.monthlyPrice}
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
