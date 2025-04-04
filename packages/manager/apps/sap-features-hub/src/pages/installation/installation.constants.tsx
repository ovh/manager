import React, { ReactNode } from 'react';
import InstallationInitialStep from './initialStep/InstallationInitialStep.page';
import InstallationStepDeployment from './stepDeployment/InstallationStepDeployment.page';
import InstallationStepOSConfig from './stepOSConfig/InstallationStepOSConfig.page';
import InstallationStepSourceInformation from './stepSourceInformation/InstallationStepSourceInformation.page';
import InstallationStepSystemInformation from './stepSystemInformation/InstallationStepSystemInformation.page';
import InstallationStepEnablement from './stepEnablement/InstallationStepEnablement.page';
import InstallationStepSummary from './stepSummary/InstallationStepSummary.page';
import { StepId } from '@/types/formStep.type';
import InstallationStepServerConfig from './stepServerConfig/InstallationStepServerConfig.page';

export const INSTALLATION_STEPS: Record<StepId, ReactNode> = {
  '1': <InstallationInitialStep />,
  '2': <InstallationStepDeployment />,
  '3': <InstallationStepSystemInformation />,
  '4': <InstallationStepSourceInformation />,
  '5': <InstallationStepOSConfig />,
  '6': <InstallationStepServerConfig />,
  '7': <InstallationStepEnablement />,
  '8': <InstallationStepSummary />,
} as const;
