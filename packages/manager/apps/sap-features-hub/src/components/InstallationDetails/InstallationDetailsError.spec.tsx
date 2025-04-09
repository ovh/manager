import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import installationTranslation from '../../../public/translations/dashboard/installation/Messages_fr_FR.json';
import { useMockInstallationTaskDetails } from '@/hooks/installationDetails/useInstallationDetails';
import {
  InstallationDetails,
  SAPInstallationStatus,
} from '@/types/installation.type';
import {
  InstallationDetailsError,
  getTranslationKeyOfStepInError,
} from './InstallationDetailsError.component';

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
    step: 'all steps',
    installation: {
      ...baseInstallation,
      ansibleSapHanaStatus: SAPInstallationStatus.failure,
      ansibleSapSystemStatus: SAPInstallationStatus.failure,
      cleanStatus: SAPInstallationStatus.failure,
      gatewayStatus: SAPInstallationStatus.failure,
      terraformStatus: SAPInstallationStatus.failure,
    },
    expected: 'dashboard_installation_progress_step_initialisation',
  },
  {
    step: 'gatewayStatus',
    installation: {
      ...baseInstallation,
      gatewayStatus: SAPInstallationStatus.failure,
    },
    expected: 'dashboard_installation_progress_step_initialisation',
  },
  {
    step: 'cleanStatus',
    installation: {
      ...baseInstallation,
      cleanStatus: SAPInstallationStatus.failure,
    },
    expected: 'dashboard_installation_progress_step_clean_resources',
  },
  {
    step: 'no step',
    installation: {
      ...baseInstallation,
    },
    expected: '',
  },
];

describe('computeProgressPercentage', () => {
  it.each(testCases)(
    'Should return $expected if $step is in failure',
    ({ installation, expected }) => {
      expect(getTranslationKeyOfStepInError(installation)).toBe(expected);
    },
  );
});

vi.mock('@/hooks/installationDetails/useInstallationDetails', () => ({
  useMockInstallationTaskDetails: vi.fn(),
}));

describe('InstallationDetailsError', () => {
  const serviceName = 'test-service';
  const taskId = '123';

  it('renders nothing if status is not failure', () => {
    (useMockInstallationTaskDetails as jest.Mock).mockReturnValue({
      data: baseInstallation,
      isLoading: false,
      isError: false,
    });

    const { container } = render(
      <InstallationDetailsError serviceName={serviceName} taskId={taskId} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders OdsMessage and error message if status is failure', () => {
    const installationInError = {
      ...baseInstallation,
      status: SAPInstallationStatus.failure,
      gatewayStatus: SAPInstallationStatus.failure,
      errorMessage: 'Test error',
      currentStep: 'stepKey',
    };
    (useMockInstallationTaskDetails as jest.Mock).mockReturnValue({
      data: installationInError,
      isLoading: false,
    });

    render(
      <InstallationDetailsError serviceName={serviceName} taskId={taskId} />,
    );

    expect(screen.getByText(/Test error/)).toBeVisible();
    expect(
      screen.getByText(
        'dashboard_installation_error_message' as keyof typeof installationTranslation,
      ),
    ).toBeVisible();
  });
});
