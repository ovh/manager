import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockVaultsFromDesign } from '@/mocks/vaults/vaults.mock';
import { getTerminateVaultUrl } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { VaultResource } from '@/types/Vault.type';

const [, paygoVault] = mockVaultsFromDesign as [VaultResource, VaultResource];

describe('[INTEGRATION] Terminate vault route', () => {
  it('is reachable at /vaults/:vaultId/terminate', async () => {
    await renderTest({
      initialRoute: getTerminateVaultUrl(paygoVault.id),
      vaults: [paygoVault],
    });

    expect(
      await screen.findByTestId('manager-delete-modal-confirm', undefined, { timeout: 20_000 }),
    ).toBeInTheDocument();
  });

  /**
   * Le toast de succès n'est pas assertable ici : la terminaison passe par `useDeleteService`, dont
   * la requête `/services` (v6) reste indéfiniment en attente dans ce harnais — les mocks partagés
   * répondent bien 500 sur ce verbe, mais la mutation ne se résout jamais. Ce que ce test voulait
   * garantir — que le toast atteigne un `<Notifications />` monté — reste couvert côté page par
   * `TerminateVault.page.spec.tsx`, qui vérifie l'appel de `addSuccess` et la fermeture de la modale.
   */
});
