import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BACKUP_AGENT_NAMESPACES } from '@/lib';
import { mockAgentDownloadLinks } from '@/mocks/agents/agentDownloadLinks';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import DownloadAgentPage from '@/pages/services/dashboard/agent/download/AgentDownload.page';

const { useBackupVSPCTenantAgentDownloadLinkMock } = vi.hoisted(() => ({
  useBackupVSPCTenantAgentDownloadLinkMock: vi.fn(),
}));

const codeTestId = 'ods-code';

// --- Mock translation ---
vi.mock('@ovhcloud/ods-components/react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-components/react');

  return {
    ...actual,
    OdsText: vi
      .fn()
      .mockImplementation(({ children }: { children: React.ReactNode }) => <p>{children}</p>),
    OdsButton: vi
      .fn()
      .mockImplementation(
        ({
          label,
          isLoading,
          isDisabled,
          ...props
        }: {
          children: React.ReactNode;
          label: string;
          isLoading: boolean;
          isDisabled: boolean;
        }) => (
          <button data-is-loading={isLoading} data-is-disabled={isDisabled} {...props}>
            {label}
          </button>
        ),
      ),
    OdsFormField: vi
      .fn()
      .mockImplementation(
        ({ children, error, ...props }: { children: React.ReactNode; error: string }) => (
          <div {...props}>
            {children}
            {!!error && <div>{error}</div>}
          </div>
        ),
      ),
    OdsSelect: vi
      .fn()
      .mockImplementation(
        ({
          children,
          onOdsChange,
          onOdsBlur,
          isDisabled,
          isRequired,
          ...props
        }: {
          children: React.ReactNode;
          name: string;
          onOdsChange: () => void;
          isDisabled: boolean;
          isRequired: boolean;
          onOdsBlur: () => void;
        }) => (
          <select
            onChange={onOdsChange}
            onBlur={onOdsBlur}
            data-disabled={isDisabled}
            data-required={isRequired}
            data-testid={`select-${props.name}`}
            {...props}
          >
            {children}
          </select>
        ),
      ),
    OdsCode: vi
      .fn()
      .mockImplementation(({ children }) => <code data-testid={codeTestId}>{children}</code>),
  };
});

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `translated_${key}`,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => ({ navigate: vi.fn() }),
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock('@/hooks/useRequiredParams', () => {
  return {
    useRequiredParams: vi.fn().mockReturnValue({
      tenantId: TENANTS_MOCKS[0]!.id,
    }),
  };
});

vi.mock('@/data/hooks/agents/getDownloadLinkAgent', () => {
  return {
    useBackupVSPCTenantAgentDownloadLink: useBackupVSPCTenantAgentDownloadLinkMock,
  };
});

const getSelectOs = () =>
  screen.getByRole('combobox', { name: `translated_${BACKUP_AGENT_NAMESPACES.AGENT}:select_os` });

describe('AgentDownload', () => {
  it('Should render AgentDownload component', async () => {
    const emptyLinkLabel = 'curl -O "..."';

    const user = userEvent.setup();
    useBackupVSPCTenantAgentDownloadLinkMock.mockReturnValue({
      data: mockAgentDownloadLinks.linuxUrl,
      isLoading: false,
    });
    render(<DownloadAgentPage />);

    await waitFor(() =>
      expect(
        screen.getByText(`translated_${BACKUP_AGENT_NAMESPACES.AGENT}:download_agent`),
      ).toBeVisible(),
    );

    expect(getSelectOs()).toBeVisible();

    expect(getSelectOs()).toHaveValue('LINUX');

    expect(useBackupVSPCTenantAgentDownloadLinkMock).toHaveBeenCalledWith({
      tenantId: TENANTS_MOCKS[0]!.id,
      os: null,
    });

    expect(screen.getAllByTestId(codeTestId)[0]).toHaveTextContent(emptyLinkLabel);

    // Prepare mock for change value
    useBackupVSPCTenantAgentDownloadLinkMock.mockReturnValue({
      data: mockAgentDownloadLinks.windowsUrl,
      isLoading: false,
    });
    useBackupVSPCTenantAgentDownloadLinkMock.mockClear();

    // Test update value on click on windows
    await user.selectOptions(getSelectOs(), ['WINDOWS']);

    expect(useBackupVSPCTenantAgentDownloadLinkMock).toHaveBeenCalledWith({
      tenantId: TENANTS_MOCKS[0]!.id,
      os: 'WINDOWS',
    });

    expect(screen.getAllByTestId(codeTestId)[0]).not.toHaveTextContent(
      mockAgentDownloadLinks.linuxUrl,
    );

    expect(screen.getAllByTestId(codeTestId)[0]).toHaveTextContent(
      mockAgentDownloadLinks.windowsUrl,
    );
  });
});
