import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InstallationStepDeployment from './InstallationStepDeployment.page';
import { FormContextType } from '@/context/InstallationForm.context';
import { testIds } from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import { installationInitialErrors } from '@/context/installationInitialValues.constants';
import { mockedValues } from '@/mocks/installationForm.mock';

const trackClickMock = vi.fn();
const useMutateSpy = vi.fn();
const navigateSpy = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => navigateSpy,
  useParams: () => ({ stepId: '2' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

vi.mock('react-hook-form', async () => {
  const original: any = await vi.importActual('react-hook-form');
  return {
    ...original,
    useForm: () => ({
      ...original.useForm(),
      formState: { isValid: true },
      handleSubmit: (cb: () => void) => () => cb(),
    }),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const original: typeof import('@tanstack/react-query') = await importOriginal();

  return {
    ...original,
    useMutation: ({ onSuccess }: { onSuccess: () => unknown }) => ({
      isPending: false,
      mutate: useMutateSpy.mockImplementation(() => onSuccess()),
    }),
  };
});
const mockSapCapabilities = {
  applicationVersions: ['Version 1.0', 'Version 2.0', 'Version 3.0'],
  applicationTypes: ['JAVA', 'ABAP'],
  deploymentTypes: ['Standard', 'Distributed'],
};
vi.mock('@/hooks/sapCapabilities/useSapCapabilities', () => ({
  useSapCapabilities: () => ({
    data: mockSapCapabilities,
    isLoading: false,
    isError: false,
  }),
}));

const initialContext: Partial<FormContextType> = {
  values: mockedValues,
  errors: installationInitialErrors,
  setValues: vi.fn(),
  setErrors: vi.fn(),
  initializationState: {
    isPrefilled: false,
    prefilledData: {
      applicationType: null,
      applicationVersion: null,
      deploymentType: null,
    } as any,
  },
};
vi.mock('@/context/InstallationForm.context', () => ({
  useInstallationFormContext: () => initialContext,
}));

const renderComponent = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <InstallationStepDeployment />
    </QueryClientProvider>,
  );

describe('InstallationStepDeployment page unit test suite', () => {
  it('should render field with correct titles and inputs', () => {
    vi.mock('@/context/InstallationForm.context', () => ({
      useInstallationFormContext: () => initialContext,
    }));
    const { getByText } = renderComponent();

    const elements = [
      'deployment_input_application_version',
      'deployment_input_application_type',
      'deployment_input_deployment_type',
    ];

    elements.forEach((element) => expect(getByText(element)).toBeVisible());
  });

  it('should validate the form server side on submit', async () => {
    renderComponent();

    const user = userEvent.setup();
    const submitCta = screen.getByTestId(testIds.formSubmitCta);
    expect(submitCta).toBeEnabled();
    await act(() => user.click(submitCta));

    waitFor(() => {
      expect(useMutateSpy).toHaveBeenCalledOnce();
      expect(navigateSpy).toHaveBeenCalledOnce();
    });
  });
});

describe('Tracking test suite', () => {
  it('should track form submit', async () => {
    renderComponent();

    const user = userEvent.setup();
    const submitCta = screen.getByTestId(testIds.formSubmitCta);

    expect(submitCta).toBeEnabled();
    await act(() => user.click(submitCta));

    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.installation.completeInformations,
    );
  });
});
