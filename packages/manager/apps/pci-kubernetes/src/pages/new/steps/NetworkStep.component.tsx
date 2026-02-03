import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';

import { ModeEnum } from '@/components/network/GatewayModeSelector.component';
import { isStandardPlan } from '@/helpers';
import { DeploymentMode, TClusterPlanEnum } from '@/types';

import { StepState } from '../hooks/useStep';
import NetworkClusterStep, { TNetworkFormState } from './NetworkClusterStep.component';

export type TNetworkStepProps = {
  region: string;
  type: DeploymentMode;
  onSubmit: (networkForm: TNetworkFormState) => void;
  step: StepState;
  plan: TClusterPlanEnum;
};

export function NetworkStep({ region, type, onSubmit, step, plan }: Readonly<TNetworkStepProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const [state, setState] = useState<TNetworkFormState>({});

  const isGatewayValid =
    !state.gateway?.isEnabled || state.gateway?.mode === ModeEnum.AUTO || state.gateway?.ip;
  const hasPrivateNetwork = state.privateNetwork;
  const isValid =
    (!isStandardPlan(plan) && (!hasPrivateNetwork || isGatewayValid)) ||
    (isStandardPlan(plan) && hasPrivateNetwork && state.gateway?.isEnabled);

  return (
    <>
      <NetworkClusterStep region={region} type={type} onChange={setState} plan={plan} />
      {!step.isLocked && (
        <OsdsButton
          className="mt-8 w-fit"
          size={ODS_BUTTON_SIZE.md}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => onSubmit(state)}
          disabled={!isValid || undefined}
        >
          {tStepper('common_stepper_next_button_label')}
        </OsdsButton>
      )}
    </>
  );
}
