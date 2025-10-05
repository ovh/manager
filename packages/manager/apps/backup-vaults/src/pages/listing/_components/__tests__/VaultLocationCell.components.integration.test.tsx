import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockVaults } from '@/mocks/vault/vaults';
import { VaultLocationCell } from '@/pages/listing/_components';
import { setupMswMock } from '@/utils/tests/setupMsw';
import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';

describe('VaultLocationCell', () => {
  it('renders location sended by the server', async () => {
    setupMswMock();
    const Providers = await testWrapperBuilder().withQueryClient().build();
    const vault = mockVaults[0]!;

    render(
      <Providers>
        <VaultLocationCell {...vault} />
      </Providers>,
    );

    await waitFor(() => expect(screen.getByText('Europe (Poland - Warsaw)')).toBeVisible(), {
      timeout: 5000,
    });
  });
});
