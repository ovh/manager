import {render, screen } from "@testing-library/react"
import {mockVaults} from "@/mocks/vault/vaults";
import {ResourceStatus} from "@/types/Vault.type";
import {VaultStatusBadge} from "./VaultStatusBadge.components";

vi.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({children}: { children: React.ReactNode }) => (
    <div data-testid="cell">{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BADGE_COLOR: {
    information: 'information',
    critical: 'critical',
    success: 'success',
    warning: 'warning',
  },
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  // eslint-disable-next-line react/no-multi-comp
  OdsBadge: ({color, label}: { color: string; label: string }) => (
    <span data-testid="badge" data-color={color}>
      {label}
    </span>
  ),
}));

describe('VaultStatusBadge', () => {
  it('renders translated status and maps READY to success color', () => {
    render(<VaultStatusBadge vaultStatus="READY" />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('ready');
    expect(badge.getAttribute('data-color')).toBe('success');
  });

  it('maps ERROR to critical color', () => {
    render(<VaultStatusBadge vaultStatus="ERROR" />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('error');
    expect(badge.getAttribute('data-color')).toBe('critical');
  });
});
