import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockVaultBucketAccess, mockVaultsFromDesign } from '@/mocks/vaults/vaults.mock';
import { VAULT_SECRET_MASK } from '@/module.constants';
import { labels } from '@/test-utils/i18ntest.utils';
import { VaultResource } from '@/types/Vault.type';

import {
  a11y,
  byName,
  copiedMessage,
  copyButton,
  copyConfirmation,
  failingAccessParams,
  fieldControls,
  findMockVault,
  maskSecret,
  paygoBucket,
  paygoVault,
  renderCredentials,
  revealSecret,
  secretField,
  waitForCredentials,
  writeText,
} from './_test/credentials.harness';

/**
 * `USE_API_MOCKS` renvoie les jeux de données sans passer par le réseau : ces tests exercent les
 * chemins d'erreur et de chargement, donc ils laissent la couche réseau s'exécuter, MSW répondant.
 */
vi.mock('@/mocks/mocks.config', () => ({ USE_API_MOCKS: false }));

describe('VaultCredentialsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the four specified fields, region and endpoint included', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(screen.getByText(labels.region.region)).toBeVisible();
    expect(screen.getByText(labels.vaults.credentials.field.endpoint)).toBeVisible();
    expect(screen.getByText(labels.system.key_access)).toBeVisible();
    expect(screen.getByText(labels.system.key_secret)).toBeVisible();
  });

  it('serves the region and the endpoint from the already-loaded list, at no extra call', async () => {
    await renderCredentials(paygoVault.id);

    expect(await screen.findByTestId('vault-credentials-region')).toHaveTextContent(
      paygoBucket.region,
    );
    expect(screen.getByTestId('vault-credentials-endpoint')).toHaveTextContent(
      's3.eu-west-par.io.cloud.ovh.net',
    );

    await waitForCredentials();
  });

  it('derives the endpoint from the bucket region when the API publishes none', async () => {
    const endpointlessVault: VaultResource = {
      ...paygoVault,
      currentState: {
        ...paygoVault.currentState,
        buckets: [{ ...paygoBucket, endPoint: undefined }],
      },
    };

    await renderCredentials(endpointlessVault.id, { vaults: [endpointlessVault] });

    expect(await screen.findByTestId('vault-credentials-endpoint')).toHaveTextContent(
      's3.eu-west-par.io.cloud.ovh.net',
    );
  });

  it('masks the secret key on open and keeps its value out of the rendered text', async () => {
    const { container } = await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(secretField()).toHaveTextContent(VAULT_SECRET_MASK);
    expect(container.textContent).not.toContain(mockVaultBucketAccess.secretKey);
  });

  it('shows the access key in clear, with no reveal control of its own', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(screen.getByTestId('vault-credentials-access-key')).toHaveTextContent(
      mockVaultBucketAccess.accessKey,
    );
    // Counted, never queried by id: wrapping the access key in the secret field — the mockup
    // regression this guards (ux.md divergence #12) — renames its toggle, so an id query would stay
    // green while a second eye control shipped.
    expect(screen.getAllByRole('button', { name: labels.actions.display })).toHaveLength(1);
    const accessKeyControls = fieldControls('vault-credentials-access-key');
    expect(accessKeyControls).toHaveLength(1);
    expect(accessKeyControls[0]).toBe(copyButton(labels.system.key_access));
  });

  it('reveals the secret key on "Show" and masks it again on "Hide"', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(byName(labels.actions.display)).toHaveAccessibleDescription(a11y.show_secret);

    await revealSecret();

    expect(secretField()).toHaveTextContent(mockVaultBucketAccess.secretKey);
    expect(byName(labels.vaults.credentials.hide)).toHaveAccessibleDescription(a11y.hide_secret);

    await maskSecret();

    expect(secretField()).toHaveTextContent(VAULT_SECRET_MASK);
  });

  it('re-masks the secret key when the modal is opened again', async () => {
    const { unmount } = await renderCredentials(paygoVault.id);

    await waitForCredentials();
    await revealSecret();
    expect(secretField()).toHaveTextContent(mockVaultBucketAccess.secretKey);

    unmount();
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(secretField()).toHaveTextContent(VAULT_SECRET_MASK);
  });

  it.each([
    ['vault-credentials-region', paygoBucket.region, labels.region.region],
    [
      'vault-credentials-endpoint',
      's3.eu-west-par.io.cloud.ovh.net',
      labels.vaults.credentials.field.endpoint,
    ],
    ['vault-credentials-access-key', mockVaultBucketAccess.accessKey, labels.system.key_access],
    ['vault-credentials-secret-key', mockVaultBucketAccess.secretKey, labels.system.key_secret],
  ])('copies %s and confirms it inside the dialog', async (_, expected, fieldLabel) => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(copyConfirmation()).toBeEmptyDOMElement();

    await userEvent.click(copyButton(fieldLabel));

    expect(writeText).toHaveBeenCalledWith(expected);
    await waitFor(() => expect(copiedMessage()).toBeVisible());
  });

  it('renews the confirmation on each copy, so every copy is announced', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    expect(copyConfirmation()).toHaveAttribute('role', 'status');
    await userEvent.click(copyButton(labels.system.key_access));
    const firstMessage = await waitFor(copiedMessage);

    await userEvent.click(copyButton(labels.region.region));

    // A live region left untouched says nothing a second time: the message has to be a new node.
    expect(copiedMessage()).not.toBe(firstMessage);
  });

  it('copies the full secret while it stays masked', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    await userEvent.click(copyButton(labels.system.key_secret));

    expect(writeText).toHaveBeenCalledWith(mockVaultBucketAccess.secretKey);
    expect(secretField()).toHaveTextContent(VAULT_SECRET_MASK);
  });

  it('shows a loader inside the modal until the credentials resolve', async () => {
    const { container } = await renderCredentials(paygoVault.id);

    expect(screen.getByTestId('vault-credentials-loading')).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();

    await waitForCredentials();

    expect(screen.queryByTestId('vault-credentials-loading')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-busy="false"]')).toBeInTheDocument();
  });

  it('reports a failed credentials call inside the modal, without any key material', async () => {
    const { container } = await renderCredentials(paygoVault.id, failingAccessParams);

    expect(await screen.findByText(labels.vaults.credentials.error)).toBeVisible();
    expect(container.textContent).not.toContain(mockVaultBucketAccess.secretKey);
    expect(container.textContent).not.toContain(mockVaultBucketAccess.accessKey);
    expect(screen.queryByTestId('vault-credentials-loading')).not.toBeInTheDocument();
  });

  it('keeps the region and the endpoint readable even when the keys fail to load', async () => {
    await renderCredentials(paygoVault.id, failingAccessParams);

    expect(await screen.findByText(labels.vaults.credentials.error)).toBeVisible();
    expect(screen.getByTestId('vault-credentials-region')).toHaveTextContent(paygoBucket.region);
  });

  it('reports a failed vault list inside the modal instead of loading for ever', async () => {
    const { container } = await renderCredentials(paygoVault.id, {
      vaults: mockVaultsFromDesign,
      isVaultListError: true,
    });

    expect(await screen.findByText(labels.vaults.credentials.error)).toBeVisible();
    expect(screen.queryByTestId('vault-credentials-loading')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
  });

  it('closes back to the list from the footer control', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    const closeButton = screen.getByTestId('secondary-button');
    expect(closeButton).toHaveAttribute('label', labels.actions.close);

    await userEvent.click(closeButton);

    expect(await screen.findByTestId('vaults-list')).toBeInTheDocument();
  });

  it('gives focus back to the row control when closed from the footer', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    await userEvent.click(screen.getByTestId('secondary-button'));

    await waitFor(() => expect(screen.getByTestId('row-trigger')).toHaveFocus());
  });

  it('gives focus back to the row control when dismissed from the header or by Escape', async () => {
    await renderCredentials(paygoVault.id);

    await waitForCredentials();
    // Both paths reach the page through the modal's `onDismiss`, which ODS raises as `odsClose`.
    fireEvent(screen.getByTestId('modal'), new CustomEvent('odsClose'));

    expect(await screen.findByTestId('vaults-list')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('row-trigger')).toHaveFocus());
  });

  it('refuses to open on a vault whose only PRIMARY bucket is not ready', async () => {
    const suspendedBucketVault = findMockVault('vault-primary-suspended');

    await renderCredentials(suspendedBucketVault.id, { vaults: [suspendedBucketVault] });

    expect(await screen.findByTestId('vaults-list')).toBeInTheDocument();
  });

  it('refuses to open on an unknown vault id', async () => {
    await renderCredentials('does-not-exist');

    expect(await screen.findByTestId('vaults-list')).toBeInTheDocument();
  });

  it('refuses to open on a vault the route serves to another product line', async () => {
    const backupAgentVault = findMockVault('vault-of-backup-agent');

    await renderCredentials(backupAgentVault.id, { vaults: [backupAgentVault] });

    expect(await screen.findByTestId('vaults-list')).toBeInTheDocument();
  });
});
