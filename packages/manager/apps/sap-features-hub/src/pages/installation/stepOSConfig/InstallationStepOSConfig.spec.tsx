import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
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
import { labels } from '@/test-utils';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';

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

const renderStepOSConfig = async () => {
  const wrapper = await testWrapperBuilder()
    .withI18next()
    .build();
  return render(<InstallationStepOSConfig />, { wrapper });
};
const { installation: l, system: lSystem, form: lForm } = labels;

describe('InstallationStepOSConfig page unit test suite', () => {
  it('should render field with correct titles and inputs', async () => {
    vi.mock('@/context/InstallationForm.context', () => ({
      useInstallationFormContext: () => initialContext,
    }));

    await renderStepOSConfig();

    const elements = [
      l.os_config_title,
      l.os_config_title,
      l.os_config_subtitle,
      lSystem.domain_name,
      `${l.os_config_input_suse} (${lForm.optional})`,
      l.os_config_toggle_update,
      l.os_config_toggle_firewall_service,
      l.os_config_toggle_firewall_server,
      l.os_config_toggle_firewall_database,
    ];

    elements.forEach((element) =>
      expect(screen.getByText(element)).toBeVisible(),
    );
  });

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

    await renderStepOSConfig();

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
    vi.mock('@/context/InstallationForm.context', () => ({
      useInstallationFormContext: () => ({
        ...initialContext,
        values: {
          ...initialContext.values,
          domainName: 'mydomain.test',
        } as InstallationFormValues,
      }),
    }));

    await renderStepOSConfig();

    const user = userEvent.setup();
    const submitCta = screen.getByTestId(testIds.formSubmitCta);

    expect(submitCta).toBeEnabled();
    await act(() => user.click(submitCta));

    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.installation.virtualMachines,
    );
  });
});
