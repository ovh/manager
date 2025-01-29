import React, { ReactNode } from 'react';
import InstallationInitialStep from './initialStep/InstallationInitialStep.page';
import InstallationStepDeployment from './stepDeployment/InstallationStepDeployment.page';
import InstallationStepOSConfig from './stepOSConfig/InstallationStepOSConfig.page';
import InstallationStepSourceInformation from './stepSourceInformation/InstallationStepSourceInformation.page';
import InstallationStepSystemInformation from './stepSystemInformation/InstallationStepSystemInformation.page';
import InstallationStepEnablement from './stepEnablement/InstallationStepEnablement.page';

export const INSTALLATION_STEPS: Record<string, ReactNode> = {
  '1': <InstallationInitialStep />,
  '2': <InstallationStepDeployment />,
  '3': <InstallationStepSystemInformation />,
  '4': <InstallationStepSourceInformation />,
  '5': <InstallationStepOSConfig />,
  '7': <InstallationStepEnablement />,
} as const;
