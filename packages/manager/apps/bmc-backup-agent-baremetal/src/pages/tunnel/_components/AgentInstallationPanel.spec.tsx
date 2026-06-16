import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';

import { AgentInstallationPanel } from './AgentInstallationPanel.component';

const { triggerDownloadMock, refetchMock, agentHookState } = vi.hoisted(() => ({
  triggerDownloadMock: vi.fn(),
  refetchMock: vi.fn(),
  agentHookState: {
    data: undefined as { linuxUrl: string; linuxDeployScript: string; windowsUrl: string } | undefined,
    isPending: false,
    isError: false,
  },
}));

vi.mock('@/hooks/useTunnelLinks', () => ({
  useTunnelLinks: () => ({
    faq: 'https://help.ovhcloud.com/csm/fr-documentation',
    installGuide: 'https://help.ovhcloud.com/csm/fr-backup-agent-first-configuration',
    orderBaremetal: 'https://www.ovhcloud.com/fr/bare-metal/',
    support: 'https://www.ovhcloud.com/fr/support-levels/',
    paymentSettings: 'https://www.ovh.com/manager/#/dedicated/billing/payment/method',
  }),
}));

vi.mock('@/utils/agentCommands', async (orig) => {
  const actual = await orig<typeof import('@/utils/agentCommands')>();
  return { ...actual, triggerDownload: triggerDownloadMock };
});

vi.mock('@/data/hooks/tunnel/useTunnelPolling.hook', () => ({
  useManagementAgent: () => ({ ...agentHookState, refetch: refetchMock }),
}));

const AGENT_LINKS = {
  linuxUrl: 'https://download.ovh.net/agent/linux/agent.sh',
  linuxDeployScript: 'bash <(curl -s https://download.ovh.net/agent/linux/install.sh)',
  windowsUrl: 'https://download.ovh.net/agent/windows/agent-1.2.3.exe',
};

const renderPanel = async (props: Partial<Parameters<typeof AgentInstallationPanel>[0]> = {}) => {
  const wrapper = await testWrapperBuilder().withI18next().build();
  return render(<AgentInstallationPanel tenantId="t1" vspcId="v1" enabled {...props} />, {
    wrapper,
  });
};

/** Dispatch ODS-18 `odsChange` CustomEvent on the host select element. */
const selectOs = async (container: HTMLElement, value: string) => {
  const select = container.querySelector('ods-select');
  await act(async () => {
    select?.dispatchEvent(new CustomEvent('odsChange', { detail: { name: 'tunnel-os', value } }));
    await Promise.resolve();
  });
};

describe('AgentInstallationPanel', () => {
  beforeEach(() => {
    triggerDownloadMock.mockClear();
    refetchMock.mockClear();
    agentHookState.data = AGENT_LINKS;
    agentHookState.isPending = false;
    agentHookState.isError = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // TC-TNL-85 — placeholder before any OS is selected (terminal tab is default)
  it('shows the terminal placeholder when no OS is selected', async () => {
    await renderPanel();
    expect(screen.getByText(/afficher les commandes/i)).toBeInTheDocument();
  });

  // TC-TNL-77 — selecting Linux displays the deploy script in the terminal tab
  it('renders the Linux deploy script after selecting Linux', async () => {
    const { container } = await renderPanel();
    await selectOs(container, 'LINUX');

    await waitFor(() => {
      const codes = container.querySelectorAll('ods-code');
      expect(codes).toHaveLength(1);
    });
    expect(screen.getByText(AGENT_LINKS.linuxDeployScript)).toBeInTheDocument();
  });

  // TC-TNL-77 / TC-TNL-84 — switching to Windows shows the single PowerShell command
  it('renders the Windows PowerShell command after selecting Windows', async () => {
    const { container } = await renderPanel();
    await selectOs(container, 'WINDOWS');

    await waitFor(() => {
      const codes = container.querySelectorAll('ods-code');
      expect(codes).toHaveLength(1);
    });
    expect(
      screen.getByText(
        `Invoke-WebRequest -Uri "${AGENT_LINKS.windowsUrl}" -OutFile "agent-1.2.3.exe"`,
      ),
    ).toBeInTheDocument();
  });

  // TC-TNL-78 / TC-TNL-79 — Manual tab download button triggers the programmatic download
  it('enables the Manual download button and triggers download with the active URL', async () => {
    const { container } = await renderPanel();
    await selectOs(container, 'LINUX');

    // Switch to the Manual tab.
    const manualTab = screen.getByText(/installation manuelle/i);
    await userEvent.click(manualTab);

    const downloadButton = container.querySelector('ods-button[label="Télécharger l\'agent"]');
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).not.toHaveAttribute('is-disabled', 'true');

    await userEvent.click(downloadButton as Element);
    expect(triggerDownloadMock).toHaveBeenCalledWith(AGENT_LINKS.linuxUrl);
  });

  // TC-TNL-82 — empty URL for the selected OS disables download + shows unavailable message
  it('disables download and shows the unavailable message when the URL is empty', async () => {
    agentHookState.data = { linuxUrl: '', linuxDeployScript: AGENT_LINKS.linuxDeployScript, windowsUrl: AGENT_LINKS.windowsUrl };
    const { container } = await renderPanel();
    await selectOs(container, 'LINUX');

    await userEvent.click(screen.getByText(/installation manuelle/i));

    const downloadButton = container.querySelector('ods-button[label="Télécharger l\'agent"]');
    expect(downloadButton).toHaveAttribute('is-disabled', 'true');
    expect(screen.getAllByText(/lien de téléchargement est indisponible/i).length).toBeGreaterThan(
      0,
    );
    await userEvent.click(downloadButton as Element);
    expect(triggerDownloadMock).not.toHaveBeenCalled();
  });

  // TC-TNL-81 — fetch error shows the critical message + Retry, and Retry refetches
  it('shows an error with a Retry button that refetches', async () => {
    agentHookState.data = undefined;
    agentHookState.isError = true;
    const { container } = await renderPanel();

    expect(screen.getByText(/chargement des liens de téléchargement/i)).toBeInTheDocument();
    const retry = container.querySelector('ods-button[label="Réessayer"]');
    expect(retry).toBeInTheDocument();
    await userEvent.click(retry as Element);
    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  // TC-TNL-80 — loading skeleton on the Manual tab while the agent data is pending
  it('shows a loading skeleton on the Manual tab while agent data is pending', async () => {
    agentHookState.data = undefined;
    agentHookState.isPending = true;
    const { container } = await renderPanel();
    await selectOs(container, 'LINUX');

    await userEvent.click(screen.getByText(/installation manuelle/i));
    expect(container.querySelector('ods-skeleton')).toBeInTheDocument();
  });

  // TC-TNL-87 — info note with the install-guide external link
  it('renders the info note with the install-guide link in a new tab', async () => {
    const { container } = await renderPanel();
    const guide = container.querySelector('ods-link[label="Consulter le guide d\'installation"]');
    expect(guide).toBeInTheDocument();
    expect(guide).toHaveAttribute('target', '_blank');
    expect(guide?.getAttribute('href')).toContain('help.ovhcloud.com');
  });

  // R16 — copying a command updates the sr-only aria-live region
  it('announces a copy via the aria-live region when a command is copied', async () => {
    const { container } = await renderPanel();
    await selectOs(container, 'LINUX');

    const code = container.querySelector('ods-code');
    await act(async () => {
      code?.dispatchEvent(new CustomEvent('odsCopy'));
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/copiée dans le presse-papiers/i),
    );
  });
});
