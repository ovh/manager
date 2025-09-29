import React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockVaults } from '@/mocks/vault/vaults';
import { VaultStatusCell } from '@/pages/listing/_components';
import { ResourceStatus } from '@/types/Vault.type';
import { labels } from '@/utils/tests/i18ntest.utils';
import { testWrapperBuilder } from '@/utils/tests/testWrapperBuilder';

describe('VaultStatusCell', () => {
  it('renders translated status and maps READY to success color', async () => {
    const Providers = await testWrapperBuilder().withI18next().build();
    const vault = { ...mockVaults[0]!, resourceStatus: 'READY' as ResourceStatus };

    const { container } = render(
      <Providers>
        <VaultStatusCell {...vault} />
      </Providers>,
    );

    const badge = container.querySelector('ods-badge')!;
    expect(badge.getAttribute('label')).toBe(labels.status.ready);
    expect(badge.getAttribute('color')).toBe('success');
  });

  it('maps ERROR to critical color', async () => {
    const Providers = await testWrapperBuilder().withI18next().build();
    const vault = { ...mockVaults[0]!, resourceStatus: 'ERROR' as ResourceStatus };

    const { container } = render(
      <Providers>
        <VaultStatusCell {...vault} />
      </Providers>,
    );

    const badge = container.querySelector('ods-badge')!;
    expect(badge.getAttribute('label')).toBe(labels.status.error);
    expect(badge.getAttribute('color')).toBe('critical');
  });
});
