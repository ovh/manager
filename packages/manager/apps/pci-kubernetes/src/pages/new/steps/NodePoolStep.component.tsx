import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';

import { useParam as useSafeParams } from '@ovh-ux/manager-pci-common';
import { Datagrid } from '@ovh-ux/manager-react-components';

import BillingStep from '@/components/create/BillingStep.component';
import { isStandardPlan } from '@/helpers';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { TClusterPlanEnum, TScalingState } from '@/types';

import useCreateNodePools from '../hooks/useCreateNodePool';
import { useClusterCreationStepper } from '../hooks/useCusterCreationStepper';
import DeploymentZone from './node-pool/DeploymentZone.component';
import NodePoolAntiAffinity from './node-pool/NodePoolAntiAffinity.component';
import NodePoolName from './node-pool/NodePoolName.component';
import NodePoolSize from './node-pool/NodePoolSize.component';
import NodePoolToggle from './node-pool/NodePoolToggle.component';
import NodePoolType from './node-pool/NodePoolType.component';
import PublicConnectivity from './node-pool/PublicConnectivity.component';
import { getDatagridColumns } from './node-pool/getDataGridColumns';

const NodePoolStep = ({
  stepper,
  plan,
}: {
  stepper: ReturnType<typeof useClusterCreationStepper>;
  plan: TClusterPlanEnum;
}) => {
  const { t } = useTranslation(['stepper', 'node-pool']);

  const { state, actions, view } = useCreateNodePools({
    isLocked: stepper.node.step.isLocked,
    name: stepper.form.region?.name,
  });

  const has3AZFeature = use3AZPlanAvailable();
  const { projectId } = useSafeParams('projectId');

  const isStandard = has3AZFeature && isStandardPlan(plan);

  const columns = useMemo(
    () =>
      getDatagridColumns({
        onDelete: actions.onDelete,
        t,
        showFloatingIp: isStandard,
      }),
    [actions.onDelete, isStandard, t],
  );

  const numberOfZoneSelected = state.nodePoolState.selectedAvailabilityZones?.filter(
    ({ checked }) => checked,
  ).length;

  return (
    <>
      {((!stepper.node.step.isLocked && state.nodePoolEnabled) || !state.nodePoolEnabled) && (
        <NodePoolToggle
          nodePoolEnabled={state.nodePoolEnabled}
          step={stepper.node.step}
          onNodePoolEnabledChange={actions.setNodePoolEnabled}
        />
      )}
      <div className="bo border-">
        <div
          className={
            !stepper.node.step.isLocked && state.nodePoolEnabled
              ? 'block'
              : 'hidden overflow-hidden'
          }
        >
          <div className="mb-6 mt-4">
            {stepper.form.region?.name && (
              <NodePoolType
                projectId={projectId}
                region={stepper.form.region.name}
                onSelect={actions.setSelectedFlavor}
              />
            )}
          </div>

          {has3AZFeature && state.nodePoolState.selectedAvailabilityZones && (
            <div className="mb-6 gap-4">
              <DeploymentZone
                multiple
                onSelect={(zones) =>
                  actions.setNodePoolState((prevState) => ({
                    ...prevState,
                    selectedAvailabilityZones: zones,
                  }))
                }
                availabilityZones={state.nodePoolState.selectedAvailabilityZones}
              />
            </div>
          )}
          {has3AZFeature && isStandard && (
            <PublicConnectivity
              checked={Boolean(state.nodePoolState.attachFloatingIps?.enabled)}
              price={state.priceFloatingIp}
              onChange={(value) => {
                actions.setNodePoolState((prevState) => ({
                  ...prevState,
                  attachFloatingIps: { enabled: value },
                }));
              }}
            />
          )}
          <div className="mb-6">
            <NodePoolSize
              isMonthlyBilled={state.isMonthlyBilled}
              onScaleChange={(scaling: TScalingState) =>
                actions.setNodePoolState((prevState) => ({
                  ...prevState,
                  scaling,
                }))
              }
              initialScaling={state.nodePoolState.scaling?.quantity}
              antiAffinity={state.nodePoolState.antiAffinity}
              isAutoscale={state.nodePoolState.scaling?.isAutoscale}
              selectedAvailabilityZones={state.nodePoolState.selectedAvailabilityZones}
            />
          </div>
          <div className="mb-8">
            <NodePoolAntiAffinity
              isChecked={state.nodePoolState.antiAffinity}
              isEnabled={!state.nodePoolState.scaling?.isAutoscale}
              onChange={(antiAffinity: boolean) =>
                actions.setNodePoolState((prevState) => ({
                  ...prevState,
                  antiAffinity,
                }))
              }
            />
          </div>
          <div className="mb-8">
            <BillingStep
              selectedAvailabilityZonesNumber={
                state.nodePoolState.selectedAvailabilityZones?.filter((e) => e.checked).length
              }
              price={state.price?.hour ?? null}
              priceFloatingIp={
                state.nodePoolState.attachFloatingIps?.enabled && state.selectedFlavor
                  ? state.priceFloatingIp
                  : null
              }
              numberOfNodes={state.nodePoolState.scaling?.quantity.desired}
              monthlyPrice={state.price?.month}
              monthlyBilling={{
                isComingSoon: view.isPricingComingSoon ?? false,
                isChecked: state.isMonthlyBilled,
                check: actions.setIsMonthlyBilled,
              }}
              warn={(state.nodePoolState.scaling?.isAutoscale && state.isMonthlyBilled) ?? false}
            />
          </div>
          <div className="mb-6">
            <NodePoolName
              onTouched={(isTouched: boolean) =>
                actions.setNodePoolState((prevState) => ({
                  ...prevState,
                  isTouched,
                }))
              }
              error={view.error}
              onNameChange={(name: string) =>
                actions.setNodePoolState((prevState) => ({
                  ...prevState,
                  name,
                }))
              }
              name={state.nodePoolState.name}
            />
          </div>
        </div>

        {!stepper.node.step.isLocked && state.nodePoolEnabled && (
          <OsdsButton
            data-testid="button-add-node"
            variant={ODS_BUTTON_VARIANT.stroked}
            className="my-6 w-fit"
            disabled={view.isButtonDisabled || !state.nodes || undefined}
            size={ODS_BUTTON_SIZE.sm}
            color={ODS_TEXT_COLOR_INTENT.primary}
            onClick={actions.createNodePool}
          >
            {numberOfZoneSelected && numberOfZoneSelected > 1
              ? t('node-pool:kube_common_add_node_pool_plural', {
                  count: numberOfZoneSelected,
                })
              : t('node-pool:kube_common_add_node_pool')}
          </OsdsButton>
        )}

        {state.nodes && (
          <>
            <OsdsText
              className="mb-4 font-bold"
              color={ODS_TEXT_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
              slot="label"
            >
              {t('node-pool:kube_common_node_pool_liste')}
            </OsdsText>
            <Datagrid
              columns={columns}
              items={state.nodes}
              totalItems={state.nodes.length}
              className="overflow-x-visible"
            />
          </>
        )}
        {view.canSubmit && (
          <OsdsButton
            data-testid="submit-button-node"
            onClick={() => {
              stepper.node.submit(state.nodes);
            }}
            className="mt-4 w-fit"
            size={ODS_BUTTON_SIZE.md}
            color={ODS_TEXT_COLOR_INTENT.primary}
          >
            {t('stepper:common_stepper_next_button_label')}
          </OsdsButton>
        )}
      </div>
    </>
  );
};

export default NodePoolStep;
