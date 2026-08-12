import React from 'react';

import { RenderResult, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockEdgeCaseVaults, mockVaultsFromDesign } from '@/mocks/vaults/vaults.mock';
import { VAULT_DEFAULT_IMMUTABILITY } from '@/module.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { MockParams, setupMswMock } from '@/test-utils/setupMsw';
import { VaultResource } from '@/types/Vault.type';

import VaultsPage from './Vaults.page';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

const [includedVault, paygoVault] = mockVaultsFromDesign as [VaultResource, VaultResource];

// Les trois lignes de la maquette sont toutes READY : le vault en cours de création vient des cas
// limites, qui couvrent les statuts que la maquette ne montre pas.
const creatingVault = mockEdgeCaseVaults.find(
  ({ id }) => id === 'vault-status-creating',
) as VaultResource;

const renderPage = async (mockParams: MockParams = {}): Promise<RenderResult> => {
  setupMswMock(mockParams);
  return renderWithProviders(<VaultsPage />);
};

const dataRows = () => screen.getAllByRole('row').slice(1);

const badge = (container: HTMLElement, label: string) =>
  container.querySelector(`ods-badge[label="${label}"]`);

const waitForRows = (expectedCount: number) =>
  waitFor(() => {
    expect(screen.queryAllByTestId('loading-row')).toHaveLength(0);
    expect(dataRows()).toHaveLength(expectedCount);
  });

describe('Vaults page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading rows in place of the data while the list is in flight', async () => {
    const { container } = await renderPage();

    expect(screen.getAllByTestId('loading-row').length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders one row per vault of this product line once the list resolves', async () => {
    const { container } = await renderPage({ vaults: mockVaultsFromDesign });

    await waitForRows(mockVaultsFromDesign.length);
    expect(screen.getByText(includedVault.currentState.name)).toBeVisible();
    expect(screen.getByText(paygoVault.currentState.name)).toBeVisible();
    expect(container.querySelector('[aria-busy="false"]')).toBeInTheDocument();
  });

  it('hides the vaults served by another product line from the same route', async () => {
    const foreignVault: VaultResource = {
      ...paygoVault,
      id: 'foreign',
      currentState: {
        ...paygoVault.currentState,
        name: 'vault-of-backup-agent',
        vaultProductLine: 'BACKUP_AGENT',
      },
    };

    await renderPage({ vaults: [paygoVault, foreignVault] });

    await waitForRows(1);
    expect(screen.getByText(paygoVault.currentState.name)).toBeVisible();
    expect(screen.queryByText('vault-of-backup-agent')).not.toBeInTheDocument();
  });

  it('hides a vault that carries no product line, even if the tab ends up empty', async () => {
    const unscopedVault: VaultResource = {
      ...paygoVault,
      currentState: { ...paygoVault.currentState, vaultProductLine: undefined },
    };

    await renderPage({ vaults: [unscopedVault] });

    expect(await screen.findByText(labels.vaults.state.empty.title)).toBeVisible();
    expect(screen.queryByText(unscopedVault.currentState.name)).not.toBeInTheDocument();
  });

  it('shows the empty state when the list comes back with no entry', async () => {
    await renderPage({ vaults: [] });

    expect(await screen.findByText(labels.vaults.state.empty.title)).toBeVisible();
  });

  it('exposes the five specified columns plus the row-action column', async () => {
    await renderPage({ vaults: [paygoVault] });

    await waitForRows(1);
    expect(screen.getByTestId('header-name')).toHaveTextContent(labels.commonDashboard.name);
    expect(screen.getByTestId('header-region')).toHaveTextContent(labels.region.region);
    expect(screen.getByTestId('header-immutability')).toHaveTextContent(
      labels.vaults.column.immutability,
    );
    expect(screen.getByTestId('header-encryption')).toHaveTextContent(
      labels.vaults.column.encryption,
    );
    expect(screen.getByTestId('header-status')).toHaveTextContent(labels.status.status);
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
  });

  it('renders the hardcoded immutability retention and the encryption invariant on every row', async () => {
    await renderPage({ vaults: mockVaultsFromDesign });

    await waitForRows(mockVaultsFromDesign.length);
    const immutability = labels.vaults.immutability_value_other.replace(
      '{{count}}',
      String(VAULT_DEFAULT_IMMUTABILITY.duration),
    );
    expect(screen.getAllByText(immutability)).toHaveLength(mockVaultsFromDesign.length);
    expect(screen.getAllByText(labels.vaults.encryption_value)).toHaveLength(
      mockVaultsFromDesign.length,
    );
  });

  it('renders the region of the vault itself, ignoring the regions of its buckets', async () => {
    await renderPage({ vaults: [includedVault] });

    await waitForRows(1);
    const [row] = dataRows() as [HTMLElement];
    expect(within(row).getByText('Paris (PAR)')).toBeVisible();
    expect(within(row).queryByText(/GRA|SBG/)).not.toBeInTheDocument();
  });

  it('falls back to the raw region code when the code is outside the mapped subset', async () => {
    const unmappedRegionVault: VaultResource = {
      ...paygoVault,
      currentState: { ...paygoVault.currentState, region: 'ap-southeast-syd' },
    };

    await renderPage({ vaults: [unmappedRegionVault] });

    await waitForRows(1);
    expect(screen.getByText('ap-southeast-syd')).toBeVisible();
  });

  it('reads the badge off the top-level resourceStatus, not off currentState.status', async () => {
    const updatingVault: VaultResource = {
      ...paygoVault,
      resourceStatus: 'UPDATING',
      currentState: { ...paygoVault.currentState, status: 'READY' },
    };

    const { container } = await renderPage({ vaults: [updatingVault] });

    await waitForRows(1);
    expect(badge(container, labels.status.error)).toBeInTheDocument();
    expect(badge(container, labels.status.ready)).not.toBeInTheDocument();
  });

  it('marks a provisioning vault as creating and a ready one as active', async () => {
    const { container } = await renderPage({ vaults: [paygoVault, creatingVault] });

    await waitForRows(2);
    expect(badge(container, labels.status.ready)).toBeInTheDocument();
    expect(badge(container, labels.status.creating)).toBeInTheDocument();
    expect(container.querySelector('ods-spinner')).toBeInTheDocument();
  });

  it('shows an error with a Retry control, and recovers the list when the retry succeeds', async () => {
    const { container } = await renderPage({ isVaultListError: true });

    expect(await screen.findByText(labels.vaults.state.error.message)).toBeVisible();
    expect(screen.getByTestId('vaults-retry')).toHaveAttribute(
      'label',
      labels.vaults.state.error.retry,
    );
    expect(container.querySelector('table')).not.toBeInTheDocument();

    setupMswMock({ vaults: [paygoVault] });
    await userEvent.click(screen.getByTestId('vaults-retry'));

    await waitForRows(1);
    expect(screen.queryByText(labels.vaults.state.error.message)).not.toBeInTheDocument();
    expect(screen.getByText(paygoVault.currentState.name)).toBeVisible();
  });

  it('offers the "Order a vault" control above the table', async () => {
    await renderPage({ vaults: [paygoVault] });

    await waitForRows(1);
    const orderButton = screen.getByTestId('order-vault');
    expect(orderButton).toHaveAttribute('label', labels.vaults.cta.order);

    await userEvent.click(orderButton);
    expect(navigateMock).toHaveBeenCalledWith('/vaults/order');
  });
});

describe('[INTEGRATION] Vaults route', () => {
  it('is reachable at /vaults', async () => {
    const { container } = await renderTest({
      initialRoute: '/vaults',
      vaults: [paygoVault],
    });

    await waitFor(() => expect(container.querySelector('table')).toBeInTheDocument(), {
      timeout: 20_000,
    });
    expect(await screen.findByText(paygoVault.currentState.name)).toBeVisible();
  });
});
