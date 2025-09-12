import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepState } from '../hooks/useStep';
import NetworkClusterStep, {
  TNetworkFormState,
} from './NetworkClusterStep.component';
import { ModeEnum } from '@/components/network/GatewayModeSelector.component';
import { DeploymentMode } from '@/types';
import { isMonoDeploymentZone, isMultiDeploymentZones } from '@/helpers';

export interface NetworkStepProps {
  region: string;
  type: DeploymentMode;
  onSubmit: (networkForm: TNetworkFormState) => void;
  step: StepState;
}

export function NetworkStep({
  region,
  type,
  onSubmit,
  step,
}: Readonly<NetworkStepProps>) {
  const { t: tStepper } = useTranslation('stepper');
  const [state, setState] = useState<TNetworkFormState>({});
  const isGatewayValid =
    !state.gateway?.isEnabled ||
    state.gateway?.mode === ModeEnum.AUTO ||
    state.gateway?.ip;
  const hasPrivateNetwork = state.privateNetwork;
  const isValid =
    (isMonoDeploymentZone(type) && (!hasPrivateNetwork || isGatewayValid)) ||
    (isMultiDeploymentZones(type) &&
      hasPrivateNetwork &&
      state.gateway?.isEnabled);

  return (
    <>
      <NetworkClusterStep region={region} type={type} onChange={setState} />
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
