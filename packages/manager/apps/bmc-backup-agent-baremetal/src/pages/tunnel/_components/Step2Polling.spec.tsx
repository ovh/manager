import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { queryKeys } from '@ovh-ux/backup-agent/data/queries/queryKeys';

import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';
import { POLLING_TIMEOUT_MS } from '@/utils/tunnel.constants';

import { Step2Polling } from './Step2Polling.component';

vi.mock('@/hooks/useTunnelLinks', () => ({
  useTunnelLinks: () => ({
    faq: 'https://help.ovhcloud.com/csm/fr-documentation',
    installGuide: 'https://help.ovhcloud.com/csm/fr-backup-agent-first-configuration',
    orderBaremetal: 'https://www.ovhcloud.com/fr/bare-metal/',
    support: 'https://www.ovhcloud.com/fr/support-levels/',
    paymentSettings: 'https://www.ovh.com/manager/#/dedicated/billing/payment/method',
  }),
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

const invalidateMock = vi.fn();
vi.mock('@tanstack/react-query', async (orig) => {
  const actual = await orig<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: invalidateMock }),
  };
});

const hookState = vi.hoisted(() => ({
  tenant: { data: undefined as unknown, isError: false },
  vspc: { data: undefined as unknown, isError: false },
  status: { data: undefined as unknown, isError: false },
}));

vi.mock('@/data/hooks/tunnel/useTunnelPolling.hook', () => ({
  useTunnelTenantPolling: () => hookState.tenant,
  useTunnelVspcPolling: () => hookState.vspc,
  useTunnelVspcStatusPolling: () => hookState.status,
  useManagementAgent: () => ({
    data: undefined,
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

const serverData = { serverName: 'ns1.eu', serverIp: '1.2.3.4', serverRegion: 'GRA' };

const renderStep2 = async (props: Partial<Parameters<typeof Step2Polling>[0]> = {}) => {
  const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
  return render(<Step2Polling serverData={serverData} onBackToStep1={vi.fn()} {...props} />, {
    wrapper,
  });
};

describe('Step2Polling', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    invalidateMock.mockClear();
    hookState.tenant = { data: undefined, isError: false };
    hookState.vspc = { data: undefined, isError: false };
    hookState.status = { data: undefined, isError: false };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // TC-TNL-29
  it('renders the locked hint when serverData is null', async () => {
    await renderStep2({ serverData: null });
    expect(screen.getByText(/disponible une fois l'étape 1 terminée/i)).toBeInTheDocument();
  });

  // TC-TNL-30 / TC-TNL-44
  it('shows the indeterminate progress bar while polling', async () => {
    const { container } = await renderStep2();
    await waitFor(() =>
      expect(container.querySelector('[data-testid="progress-bar-indeterminate"]')).toBeInTheDocument(),
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-busy', 'true');
  });

  // TC-TNL-45 / TC-TNL-34 / TC-TNL-90
  it('reaches ready, shows the full bar, and invalidates the 4 caches + navigates on Continue', async () => {
    hookState.tenant = { data: [{ id: 't1' }], isError: false };
    hookState.vspc = { data: [{ id: 'v1' }], isError: false };
    hookState.status = { data: { id: 'v1', resourceStatus: 'READY' }, isError: false };

    const { container } = await renderStep2();

    await waitFor(() =>
      expect(container.querySelector('[data-testid="progress-bar-full"]')).toBeInTheDocument(),
    );
    expect(screen.getByText('100%')).toBeInTheDocument();

    const continueButton = container.querySelector(`ods-button[label="Continuer"]`);
    expect(continueButton).toBeInTheDocument();

    await userEvent.click(continueButton as Element);

    expect(invalidateMock).toHaveBeenCalledWith({ queryKey: queryKeys.tenants.all });
    expect(invalidateMock).toHaveBeenCalledWith({ queryKey: queryKeys.tenants.vspc.all() });
    expect(invalidateMock).toHaveBeenCalledWith({ queryKey: queryKeys.agents.all() });
    expect(invalidateMock).toHaveBeenCalledWith({ queryKey: queryKeys.baremetals.all });
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  // TC-TNL-35 / TC-TNL-46
  it('shows creation error with Retry + Back to Step 1, and no Continue', async () => {
    hookState.tenant = { data: [{ id: 't1' }], isError: false };
    hookState.vspc = { data: [{ id: 'v1' }], isError: false };
    hookState.status = { data: { id: 'v1', resourceStatus: 'ERROR' }, isError: false };

    const { container } = await renderStep2();

    await waitFor(() =>
      expect(screen.getByText('La création du service a échoué.')).toBeInTheDocument(),
    );
    expect(container.querySelector(`ods-button[label="Réessayer"]`)).toBeInTheDocument();
    expect(container.querySelector(`ods-button[label="Revenir à l'étape 1"]`)).toBeInTheDocument();
    expect(container.querySelector(`ods-button[label="Continuer"]`)).not.toBeInTheDocument();
  });

  // TC-TNL-36 / TC-TNL-46
  it('shows a network error with Retry only when polling fails', async () => {
    hookState.tenant = { data: undefined, isError: true };

    const { container } = await renderStep2();

    await waitFor(() =>
      expect(screen.getByText('Une erreur réseau est survenue.')).toBeInTheDocument(),
    );
    expect(container.querySelector(`ods-button[label="Réessayer"]`)).toBeInTheDocument();
    expect(
      container.querySelector(`ods-button[label="Revenir à l'étape 1"]`),
    ).not.toBeInTheDocument();
  });

  // TC-TNL-39 / TC-TNL-47
  it('transitions to timeout after 30 minutes and offers only a support link', async () => {
    const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
    vi.useFakeTimers();
    const { container } = render(<Step2Polling serverData={serverData} onBackToStep1={vi.fn()} />, {
      wrapper,
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLLING_TIMEOUT_MS + 1000);
    });

    expect(screen.getByText(/plus de temps que prévu/i)).toBeInTheDocument();
    expect(container.querySelector('ods-link[label="Contacter le support"]')).toBeInTheDocument();
    expect(container.querySelector('ods-button[label="Réessayer"]')).not.toBeInTheDocument();
  });

  // TC-TNL-40
  it('does not override the ready state when the timeout fires late', async () => {
    hookState.tenant = { data: [{ id: 't1' }], isError: false };
    hookState.vspc = { data: [{ id: 'v1' }], isError: false };
    hookState.status = { data: { id: 'v1', resourceStatus: 'READY' }, isError: false };

    const wrapper = await testWrapperBuilder().withI18next().withQueryClient().build();
    vi.useFakeTimers();
    const { container } = render(<Step2Polling serverData={serverData} onBackToStep1={vi.fn()} />, {
      wrapper,
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(container.querySelector('[data-testid="progress-bar-full"]')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(POLLING_TIMEOUT_MS + 1000);
    });

    expect(screen.queryByText(/plus de temps que prévu/i)).not.toBeInTheDocument();
    expect(container.querySelector('[data-testid="progress-bar-full"]')).toBeInTheDocument();
  });
});
