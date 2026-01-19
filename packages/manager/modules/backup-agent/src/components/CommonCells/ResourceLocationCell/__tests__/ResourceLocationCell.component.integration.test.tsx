import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { setupMswMock } from '@/test-utils/setupMsw';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';

import { ResourceLocationCell } from '../ResourceLocationCell.component';

describe('ResourceLocationCell', () => {
  it('renders locations sended by the server', async () => {
    setupMswMock();
    const Providers = await testWrapperBuilder().withQueryClient().build();
    const vault = mockVaults[0]!;

    render(
      <Providers>
        <ResourceLocationCell region={vault.currentState.region} />
      </Providers>,
    );

    await waitFor(() => expect(screen.getByText('Europe (Poland - Warsaw)')).toBeVisible(), {
      timeout: 5000,
    });
  });
});
