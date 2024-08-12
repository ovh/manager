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
  Notifications,
  StepComponent,
  useNotifications,
} from '@ovhcloud/manager-components';
import { FlavorSelector } from '@ovh-ux/manager-pci-common';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNewPoolStore } from '@/pages/detail/nodepools/new/store';
import { StepsEnum } from '@/pages/detail/nodepools/new/steps.enum';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { Autoscaling } from '@/components/Autoscaling.component';
import { createNodePool, TCreateNodePoolParam } from '@/api/data/node-pools';
import { useCatalog } from '@/api/hooks/catalog';
import BillingStep, {
  TBillingStepProps,
} from '@/components/create/BillingStep';
import {
  ANTI_AFFINITY_MAX_NODES,
  NAME_INPUT_CONSTRAINTS,
} from '@/pages/detail/nodepools/new/constants';
import queryClient from '@/queryClient';

export default function NewPage(): JSX.Element {
  const { t: tCommon } = useTranslation('common');
  const { t: tListing } = useTranslation('listing');
  const { t: tAdd } = useTranslation('add');
  const { t: tAddForm } = useTranslation('add-form');

  const { tracking } = useContext(ShellContext).shell;

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
    name: { isTouched: false, hasError: false },
  });

  const [billingState, setBillingState] = useState<TBillingStepProps>({
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

  // Set error message for name input
  useEffect(() => {
    if (state.name.isTouched) {
      setState((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          hasError:
            store.name?.length > NAME_INPUT_CONSTRAINTS.MAX_LENGTH ||
            !NAME_INPUT_CONSTRAINTS.PATTERN.exec(store.name),
        },
      }));
    }
  }, [store.name, state.name.isTouched]);

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
    tracking.trackClick({
      name: `details::nodepools::add::confirm`,
      type: 'action',
    });

    setState((prev) => ({
      ...prev,
      isAdding: true,
    }));

    const param: TCreateNodePoolParam = {
      flavorName: store.flavor?.name || '',
      name: store.name,
      antiAffinity: store.antiAffinity,
      monthlyBilled: store.isMonthlyBilling,
      autoscale: store.autoScaling.isAutoscale,
      minNodes: store.autoScaling.quantity.min,
      desiredNodes: store.autoScaling.isAutoscale
        ? store.autoScaling.quantity.min
        : store.autoScaling.quantity.desired,
      maxNodes: store.autoScaling.quantity.max,
    };

    createNodePool(projectId, clusterId, param)
      .then(() => {
        addSuccess(
          <Translation ns="add">
            {(_t) =>
              _t('kube_add_node_pool_success', {
                nodePoolName: store.name,
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
                nodePoolName: store.name,
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

  return (
    <>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._700}
      >
        {tListing('kube_common_create_node_pool')}
      </OsdsText>

      <Notifications />

      <StepComponent
        id={StepsEnum.NAME}
        order={1}
        title={tAdd('kube_add_node_pool_config_title')}
        isOpen={store.steps.get(StepsEnum.NAME).isOpen}
        isChecked={store.steps.get(StepsEnum.NAME).isChecked}
        isLocked={store.steps.get(StepsEnum.NAME).isLocked}
        next={{
          action:
            state.name.isTouched && !state.name.hasError
              ? () => {
                  store.check(StepsEnum.NAME);
                  store.lock(StepsEnum.NAME);
                  store.open(StepsEnum.TYPE);
                }
              : undefined,
          label: tCommon('common_stepper_next_button_label'),
        }}
        edit={{
          action: () => {
            store.edit(StepsEnum.NAME);
          },
          label: tCommon('common_stepper_modify_this_step'),
        }}
      >
        <OsdsFormField
          className="mt-4"
          inline
          error={
            state.name.hasError
              ? tAdd('kube_add_node_pool_name_input_pattern_validation_error')
              : undefined
          }
        >
          <OsdsText
            slot="label"
            color={
              state.name.hasError
                ? ODS_THEME_COLOR_INTENT.error
                : ODS_THEME_COLOR_INTENT.text
            }
            className="mt-4"
            size={ODS_TEXT_SIZE._100}
          >
            {tAdd('kube_add_node_pool_name_label')}
          </OsdsText>
          <OsdsInput
            value={store.name}
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            onOdsValueChange={(e) => {
              setState((prev) => ({
                ...prev,
                name: { ...prev.name, isTouched: true },
              }));
              store.set.name(e.detail.value);
            }}
            type={ODS_INPUT_TYPE.text}
            error={state.name.hasError}
            className="border"
          />
        </OsdsFormField>
      </StepComponent>
      <StepComponent
        id={StepsEnum.TYPE}
        title={tListing('kube_common_node_pool_title')}
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
          label: tCommon('common_stepper_next_button_label'),
        }}
        edit={{
          action: () => {
            store.edit(StepsEnum.TYPE);
          },
          label: tCommon('common_stepper_modify_this_step'),
        }}
      >
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        >
          {tAddForm('kubernetes_add_node_pool_description')}
        </OsdsText>
        <br />
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
        >
          {tAddForm('kubernetes_add_node_pool_node_type')}
        </OsdsText>
        {!isClusterPending && (
          <FlavorSelector
            projectId={projectId}
            region={cluster.region}
            onSelect={(flavor) => {
              store.set.flavor(flavor);
            }}
          />
        )}
      </StepComponent>
      <StepComponent
        id={StepsEnum.SIZE}
        title={tListing('kube_common_node_pool_autoscaling_title')}
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
          label: tCommon('common_stepper_next_button_label'),
        }}
        edit={{
          action: () => {
            store.edit(StepsEnum.SIZE);
          },
          label: tCommon('common_stepper_modify_this_step'),
        }}
      >
        <Autoscaling
          autoscale={false}
          onChange={(auto) => store.set.autoScaling(auto)}
        />
      </StepComponent>
      <StepComponent
        id={StepsEnum.BILLING}
        title={tAdd('kube_add_billing_anti_affinity_title')}
        isOpen={store.steps.get(StepsEnum.BILLING).isOpen}
        isChecked={store.steps.get(StepsEnum.BILLING).isChecked}
        isLocked={store.steps.get(StepsEnum.BILLING).isLocked}
        order={4}
      >
        <BillingStep
          antiAffinity={billingState.antiAffinity}
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
              {tListing('kube_common_save')}
            </OsdsButton>
            <OsdsButton
              inline
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.ghost}
              className="ml-4"
              onClick={() => {
                tracking.trackClick({
                  name: `details::nodepools::add::cancel`,
                  type: 'action',
                });
                navigate('../nodepools');
              }}
            >
              {tCommon('common_stepper_cancel_button_label')}
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
              {tAdd('kube_add_node_pool_creating')}
            </OsdsText>
          </div>
        )}
      </StepComponent>
    </>
  );
}
