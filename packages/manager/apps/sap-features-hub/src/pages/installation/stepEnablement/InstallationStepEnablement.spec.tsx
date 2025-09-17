import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import InstallationStepEnablement from './InstallationStepEnablement.page';
import { installationInitialValues } from '@/context/installationInitialValues.constants';
import { FORM_LABELS } from '@/constants/form.constants';
import { testIds } from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import { labels } from '@/test-utils';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';

const trackClickMock = vi.fn();
const navigateSpy = vi.fn();

const useMutateSpy = vi.fn();

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

vi.mock('@/context/InstallationForm.context', () => ({
  useInstallationFormContext: () => ({
    values: installationInitialValues,
    setValues: vi.fn(),
  }),
}));

const renderEnablementStep = async () => {
  const wrapper = await testWrapperBuilder()
    .withI18next()
    .build();
  return render(<InstallationStepEnablement />, { wrapper });
};
const { installation: l, system: lSystem } = labels;

describe('InstallationStepEnablement page unit test suite', () => {
  it('should render field with correct titles and inputs', async () => {
    vi.mock('@/context/InstallationForm.context', () => ({
      useInstallationFormContext: () => ({
        values: installationInitialValues,
        setValues: vi.fn(),
      }),
    }));

    await renderEnablementStep();

    const elementsPreVisible = [
      l.enablement_input_has_backup,
      l.enablement_input_has_logs_ldp_ovh_helper,
    ];

    elementsPreVisible.forEach((element) =>
      expect(screen.getByText(element, { exact: true })).toBeVisible(),
    );
  });

  it('should render field with correct titles and inputs when the form is already ready', async () => {
    vi.mock('@/context/InstallationForm.context', () => ({
      useInstallationFormContext: () => ({
        values: {
          ...installationInitialValues,
          bucketBackint: {
            id: 'my-container-123',
            endpoint: 'https://storage.example.com',
            accessKey: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6',
            secretKey: 'P6O5N4M3L2K1J0I9H8G7F6E5D4C3B2A1',
          },
          logsDataPlatform: {
            entrypoint: 'https://mylogs.logs.ovh.com',
            certificate: '',
          },
        },
        setValues: vi.fn(),
      }),
    }));

    await renderEnablementStep();

    const elements = [
      l.enablement_input_has_backup,
      l.common_input_container,
      l.enablement_input_id_container_tooltip,
      l.common_helper_container,
      FORM_LABELS.endpoint,
      l.common_helper_endpoint,
      lSystem.key_access,
      l.common_helper_access_key,
      lSystem.key_secret,
      l.common_helper_secret_key,
      l.enablement_input_has_logs_ldp_ovh,
      l.enablement_input_has_logs_ldp_ovh_helper,
      l.enablement_input_logstash_entrypoint,
      l.enablement_input_logstash_entrypoint_helper,
      l.enablement_input_logstash_certificat,
    ];

    await waitFor(
      () => {
        elements.forEach((element) =>
          expect(screen.getByText(element, { exact: true })).toBeVisible(),
        );
      },
      { timeout: 5_000 },
    );
  });

  it('should validate server side form on submit before go next page', async () => {
    await renderEnablementStep();

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
    await renderEnablementStep();

    const user = userEvent.setup();
    const submitCta = screen.getByTestId(testIds.formSubmitCta);

    expect(submitCta).toBeEnabled();
    await act(() => user.click(submitCta));

    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.installation.startSAPDeployment,
    );
  });
});
