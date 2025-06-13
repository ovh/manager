import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import InstallationStepOSConfig from './InstallationStepOSConfig.page';
import { TRACKING } from '@/tracking.constants';
import { testIds } from '@/utils/testIds.constants';
import {
  installationInitialErrors,
  installationInitialValues,
} from '@/context/installationInitialValues.constants';
import { InstallationFormValues } from '@/types/form.type';
import { FormContextType } from '@/context/InstallationForm.context';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/somewhere' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({ stepId: '1' }),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

const initialContext: Partial<FormContextType> = {
  values: installationInitialValues,
  errors: installationInitialErrors,
  setValues: vi.fn(),
  setErrors: vi.fn(),
};
vi.mock('@/context/InstallationForm.context', () => ({
  useInstallationFormContext: () => initialContext,
}));

describe('InstallationStepOSConfig page unit test suite', () => {
  it('should render field with correct titles and inputs', () => {
    vi.mock('@/context/InstallationForm.context', () => ({
      useInstallationFormContext: () => initialContext,
    }));

    render(<InstallationStepOSConfig />);

    const elements = [
      'os_config_title',
      'os_config_subtitle',
      'os_config_input_domain',
      'os_config_input_suse (optional_label)',
      'os_config_toggle_update',
      'os_config_toggle_firewall_service',
      'os_config_toggle_firewall_server',
      'os_config_toggle_firewall_database',
    ];

    elements.forEach((element) =>
      expect(screen.getByText(element)).toBeVisible(),
    );
  });
});

describe('Tracking test suite', () => {
  it('should track form submit', async () => {
    vi.mock('@/context/InstallationForm.context', () => ({
      useInstallationFormContext: () => ({
        ...initialContext,
        values: {
          ...initialContext.values,
          domainName: 'mydomain.test',
        } as InstallationFormValues,
      }),
    }));

    render(<InstallationStepOSConfig />);

    const user = userEvent.setup();
    const submitCta = screen.getByTestId(testIds.formSubmitCta);

    expect(submitCta).toBeEnabled();
    await act(() => user.click(submitCta));

    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.installation.virtualMachines,
    );
  });
});
