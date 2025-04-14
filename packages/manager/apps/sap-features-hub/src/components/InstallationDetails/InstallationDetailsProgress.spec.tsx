import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import {
  computeProgressPercentage,
  StepStatusIcon,
} from './InstallationDetailsProgress.component';
import {
  InstallationDetails,
  SAPInstallationStatus,
} from '@/types/installation.type';

describe('StepStatusIcon', () => {
  it.each([
    [
      SAPInstallationStatus.success,
      'dashboard_installation_progress_step_success',
    ],
    [
      SAPInstallationStatus.failure,
      'dashboard_installation_progress_step_failure',
    ],
    [
      SAPInstallationStatus.revoked,
      'dashboard_installation_progress_step_failure',
    ],
    [
      SAPInstallationStatus.started,
      'dashboard_installation_progress_step_pending',
    ],
    [
      SAPInstallationStatus.retry,
      'dashboard_installation_progress_step_pending',
    ],
    [
      SAPInstallationStatus.pending,
      'dashboard_installation_progress_step_waiting',
    ],
  ] as const)('should render %s icon', (status, ariaLabel) => {
    const { getByLabelText } = render(<StepStatusIcon status={status} />);
    const icon = getByLabelText(ariaLabel);
    expect(icon).toBeInTheDocument();
  });
});

const baseInstallation: InstallationDetails = {
  ansibleSapHanaStatus: SAPInstallationStatus.pending,
  ansibleSapSystemStatus: SAPInstallationStatus.pending,
  applicationType: 'ABAP',
  applicationVersion: '1.0.0',
  cleanStatus: SAPInstallationStatus.pending,
  deploymentType: 'Standard',
  endTime: null,
  errorMessage: null,
  gatewayStatus: SAPInstallationStatus.pending,
  sapHanaSid: 'SID',
  sapSid: 'SID',
  startTime: '2020-01-01T00:00:00Z',
  status: SAPInstallationStatus.pending,
  taskId: 'task-1',
  iam: {
    id: '',
    urn: '',
  },
  terraformStatus: SAPInstallationStatus.pending,
};

const testCases = [
  {
    description: 'returns 100 when cleanStatus is SUCCESS',
    installation: {
      ...baseInstallation,
      cleanStatus: SAPInstallationStatus.success,
    },
    expected: 100,
  },
  {
    description: 'returns 95 when ansibleSapSystemStatus is SUCCESS',
    installation: {
      ...baseInstallation,
      ansibleSapSystemStatus: SAPInstallationStatus.success,
    },
    expected: 95,
  },
  {
    description: 'returns 50 when ansibleSapHanaStatus is SUCCESS',
    installation: {
      ...baseInstallation,
      ansibleSapHanaStatus: SAPInstallationStatus.success,
    },
    expected: 50,
  },
  {
    description: 'returns 25 when terraformStatus is SUCCESS',
    installation: {
      ...baseInstallation,
      terraformStatus: SAPInstallationStatus.success,
    },
    expected: 25,
  },
  {
    description: 'returns 5 when gatewayStatus is SUCCESS',
    installation: {
      ...baseInstallation,
      gatewayStatus: SAPInstallationStatus.success,
    },
    expected: 5,
  },
  {
    description: 'returns 0 when none of the statuses are SUCCESS',
    installation: baseInstallation,
    expected: 0,
  },
  {
    description:
      'returns highest priority value when multiple statuses are SUCCESS',
    installation: {
      ...baseInstallation,
      ansibleSapSystemStatus: SAPInstallationStatus.success,
      terraformStatus: SAPInstallationStatus.success,
      gatewayStatus: SAPInstallationStatus.success,
    },
    expected: 95,
  },
];

describe('computeProgressPercentage', () => {
  it.each(testCases)('$description', ({ installation, expected }) => {
    expect(computeProgressPercentage(installation)).toBe(expected);
  });
});
