import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockEdgeCaseVaults, mockVaults, mockVaultsFromDesign } from '@/mocks/vaults/vaults.mock';
import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { setupMswMock } from '@/test-utils/setupMsw';
import { VaultResource } from '@/types/Vault.type';
import { IAM_ACTIONS } from '@/utils/iam.constants';

import { getVaultActionsMenuId } from '../vaults.constants';
import { VaultActionsCell } from './VaultActionsCell.component';

/**
 * `USE_API_MOCKS` court-circuite le réseau et renvoie les jeux de données du module. Ces tests
 * paramètrent leurs propres fixtures via MSW, donc ils laissent la couche réseau s'exécuter.
 */
vi.mock('@/mocks/mocks.config', () => ({ USE_API_MOCKS: false }));

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

const [includedVault, paygoVault] = mockVaultsFromDesign as [VaultResource, VaultResource];
const findVault = (name: string) =>
  [...mockVaults, ...mockEdgeCaseVaults].find(
    ({ currentState }) => currentState.name === name,
  ) as VaultResource;

const openMenu = (vaultId: string) =>
  userEvent.click(screen.getByTestId(`vault-actions-trigger-${vaultId}`));

// `is-disabled` is reflected synchronously, `disabled` is dropped on the next ODS render — and only the
// latter decides whether a pointer event reaches the entry, so both have to settle.
const waitForEntryEnabled = async (testId: string) => {
  await waitFor(() => {
    expect(screen.getByTestId(testId)).toHaveAttribute('is-disabled', 'false');
    expect(screen.getByTestId(testId)).not.toHaveAttribute('disabled');
  });
  return screen.getByTestId(testId);
};

const entry = (testId: string) => screen.getByTestId(testId);

describe('VaultActionsCell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMswMock();
  });

  it('offers exactly the credentials and terminate entries', async () => {
    const { container } = await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);

    await waitFor(() =>
      expect(container.querySelectorAll('ods-popover ods-button')).toHaveLength(2),
    );
    expect(
      container.querySelector(`ods-button[label="${labels.vaults.action.show_credentials}"]`),
    ).toBeInTheDocument();
    expect(
      container.querySelector(`ods-button[label="${labels.actions.terminate}"]`),
    ).toBeInTheDocument();
  });

  it('names the icon-only trigger for assistive technology', async () => {
    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    expect(await screen.findByRole('button', { name: labels.vaults.action.menu_label })).toBe(
      screen.getByTestId(`vault-actions-trigger-${paygoVault.id}`),
    );
  });

  it('opens the termination modal of the row on a PAYGO vault', async () => {
    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    await userEvent.click(await waitForEntryEnabled(`vault-terminate-${paygoVault.id}`));

    expect(navigateMock).toHaveBeenCalledWith(`/vaults/${paygoVault.id}/terminate`);
  });

  it('opens the credentials modal of the row', async () => {
    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    await userEvent.click(await waitForEntryEnabled(`vault-credentials-${paygoVault.id}`));

    expect(navigateMock).toHaveBeenCalledWith(`/vaults/${paygoVault.id}/credentials`);
  });

  it('offers the terminate entry of the included vault as a named, unavailable control', async () => {
    const { container } = await renderWithProviders(<VaultActionsCell vault={includedVault} />);

    await openMenu(includedVault.id);

    const disabledEntry = screen.getByRole('button', { name: labels.actions.terminate });
    expect(disabledEntry).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByTestId(`vault-terminate-${includedVault.id}`)).not.toBeInTheDocument();
    // The ODS button is the visual shell of the entry, not a second control announced after it.
    expect(entry(`vault-terminate-disabled-${includedVault.id}`)).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    const tooltipId = `vault-terminate-tooltip-${includedVault.id}`;
    expect(disabledEntry).toHaveAttribute('aria-describedby', tooltipId);
    await waitFor(() =>
      expect(container.querySelector(`#${tooltipId}`)).toHaveTextContent(
        labels.vaults.terminate.included_tooltip,
      ),
    );
  });

  it.each([
    ['whose only PRIMARY bucket is not ready', 'vault-primary-suspended'],
    ['that carries no bucket at all', 'vault-without-bucket'],
  ])(
    'offers the credentials entry of a vault %s as a named, unavailable control',
    async (_, vaultName) => {
      const vault = findVault(vaultName);

      const { container } = await renderWithProviders(<VaultActionsCell vault={vault} />);

      await openMenu(vault.id);

      const disabledEntry = await screen.findByRole('button', {
        name: labels.vaults.action.show_credentials,
      });
      expect(disabledEntry).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByTestId(`vault-credentials-${vault.id}`)).not.toBeInTheDocument();
      expect(entry(`vault-credentials-disabled-${vault.id}`)).toHaveAttribute(
        'aria-hidden',
        'true',
      );

      const tooltipId = `vault-credentials-tooltip-${vault.id}`;
      expect(disabledEntry).toHaveAttribute('aria-describedby', tooltipId);
      await waitFor(() =>
        expect(container.querySelector(`#${tooltipId}`)).toHaveTextContent(
          labels.vaults.action.credentials_disabled_tooltip,
        ),
      );
    },
  );

  it('keeps the credentials entry on a vault whose PRIMARY bucket is ready', async () => {
    const vault = findVault('vault-two-primaries');

    await renderWithProviders(<VaultActionsCell vault={vault} />);
    await openMenu(vault.id);

    expect(screen.getByTestId(`vault-credentials-${vault.id}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`vault-credentials-disabled-${vault.id}`)).not.toBeInTheDocument();
  });

  it('disables the credentials entry when the account lacks the credentials action', async () => {
    setupMswMock({ unauthorizedIamActions: [IAM_ACTIONS.vaultCredentialsGet] });

    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    await waitForEntryEnabled(`vault-terminate-${paygoVault.id}`);

    expect(entry(`vault-credentials-${paygoVault.id}`)).toHaveAttribute('is-disabled', 'true');
  });

  it('disables the terminate entry when the account lacks the termination action', async () => {
    setupMswMock({ unauthorizedIamActions: [IAM_ACTIONS.servicesTerminate] });

    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    await waitForEntryEnabled(`vault-credentials-${paygoVault.id}`);

    expect(entry(`vault-terminate-${paygoVault.id}`)).toHaveAttribute('is-disabled', 'true');
  });

  it('defers the authorization check until the menu is opened', async () => {
    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    expect(entry(`vault-credentials-${paygoVault.id}`)).toHaveAttribute('is-disabled', 'true');

    await openMenu(paygoVault.id);

    await waitForEntryEnabled(`vault-credentials-${paygoVault.id}`);
  });

  it('advertises no permission error, and adds no wrapper, on an unauthorized entry', async () => {
    setupMswMock({ unauthorizedIamActions: [IAM_ACTIONS.servicesTerminate] });

    const { container } = await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    await waitFor(() =>
      expect(entry(`vault-terminate-${paygoVault.id}`)).toHaveAttribute('is-disabled', 'true'),
    );
    expect(container.querySelector('ods-popover ods-tooltip')).not.toBeInTheDocument();
    expect(container.querySelector('ods-popover div.w-fit')).not.toBeInTheDocument();
  });

  it('keeps both entries disabled on a vault the API serves without an IAM envelope', async () => {
    const vault = findVault('vault-without-iam-envelope');
    expect(vault.iam).toBeUndefined();

    await renderWithProviders(<VaultActionsCell vault={vault} />);

    await openMenu(vault.id);

    await waitFor(() =>
      expect(entry(`vault-credentials-${vault.id}`)).toHaveAttribute('is-disabled', 'true'),
    );
    expect(entry(`vault-terminate-${vault.id}`)).toHaveAttribute('is-disabled', 'true');
  });

  it('does not gate a non-US customer on the action guarding the US-only DELETE form', async () => {
    setupMswMock({
      unauthorizedIamActions: [IAM_ACTIONS.servicesTerminateWithoutConfirmation],
    });

    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);

    expect(await waitForEntryEnabled(`vault-terminate-${paygoVault.id}`)).toHaveAttribute(
      'is-disabled',
      'false',
    );
  });

  it('disables the terminate entry when the serviceId resolution is not granted', async () => {
    setupMswMock({ unauthorizedIamActions: [IAM_ACTIONS.servicesGet] });

    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    await waitForEntryEnabled(`vault-credentials-${paygoVault.id}`);

    expect(entry(`vault-terminate-${paygoVault.id}`)).toHaveAttribute('is-disabled', 'true');
  });
});

describe('VaultActionsCell menu disclosure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMswMock();
  });

  const trigger = () => screen.getByTestId(`vault-actions-trigger-${paygoVault.id}`);

  it('announces itself as a collapsed menu button owning the popover', async () => {
    const { container } = await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    const menuId = getVaultActionsMenuId(paygoVault.id);
    expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveAttribute('aria-controls', menuId);
    expect(container.querySelector(`ods-popover#${menuId}`)).toBeInTheDocument();
  });

  it('follows the open state the popover reports', async () => {
    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    await waitFor(() => expect(trigger()).toHaveAttribute('aria-expanded', 'true'));

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(trigger()).toHaveAttribute('aria-expanded', 'false'));
  });

  it('gives focus back to the trigger when Escape closes the menu on a focused entry', async () => {
    await renderWithProviders(<VaultActionsCell vault={paygoVault} />);

    await openMenu(paygoVault.id);
    (await waitForEntryEnabled(`vault-credentials-${paygoVault.id}`)).focus();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('leaves focus where a click outside the menu put it', async () => {
    await renderWithProviders(
      <>
        <button type="button" data-testid="outside" />
        <VaultActionsCell vault={paygoVault} />
      </>,
    );

    await openMenu(paygoVault.id);
    await waitFor(() => expect(trigger()).toHaveAttribute('aria-expanded', 'true'));

    await userEvent.click(screen.getByTestId('outside'));

    await waitFor(() => expect(trigger()).toHaveAttribute('aria-expanded', 'false'));
    expect(screen.getByTestId('outside')).toHaveFocus();
  });
});
