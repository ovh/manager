import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults';
import { VaultLocationCell } from '../VaultLocationCell.components';
import { setupMswMock } from '../../../../../test-utils/setupMsw';
import { testWrapperBuilder } from '../../../../../test-utils/testWrapperBuilder';

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
