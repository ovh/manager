import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { queryKeys } from '@/data/queries/queryKeys';
import { BACKUP_AGENT_NAMESPACES } from '@/lib';
import { mockAgentDownloadLinks } from '@/mocks/agents/agentDownloadLinks';
import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import DownloadAgentPage from '@/pages/services/dashboard/agent/download/AgentDownload.page';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

const codeTestId = 'ods-code';

// --- Mock ODS ---
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

const getSelectOs = () =>
  screen.getByRole('combobox', { name: `translated_${BACKUP_AGENT_NAMESPACES.AGENT}:select_os` });

describe('AgentDownload', () => {
  it('Should render AgentDownload component', async () => {
    const emptyLinkLabel = 'curl -O "..."';

    const queryClient = createQueryClientTest();
    queryClient.setQueryData(queryKeys.agents.downloadLink(), mockAgentDownloadLinks);

    const wrapper = await testWrapperBuilder().withQueryClient(queryClient).build();

    const user = userEvent.setup();

    render(<DownloadAgentPage />, { wrapper });

    await waitFor(() =>
      expect(
        screen.getByText(`translated_${BACKUP_AGENT_NAMESPACES.AGENT}:download_agent`),
      ).toBeVisible(),
    );

    expect(getSelectOs()).toBeVisible();

    // Initially no OS selected → download code shows "..."
    expect(screen.getAllByTestId(codeTestId)[0]).toHaveTextContent(emptyLinkLabel);

    // Select WINDOWS
    await user.selectOptions(getSelectOs(), ['WINDOWS']);

    // After selecting WINDOWS, the download link should show the windows URL
    await waitFor(() =>
      expect(screen.getAllByTestId(codeTestId)[0]).toHaveTextContent(
        mockAgentDownloadLinks.windowsUrl,
      ),
    );
  });
});
