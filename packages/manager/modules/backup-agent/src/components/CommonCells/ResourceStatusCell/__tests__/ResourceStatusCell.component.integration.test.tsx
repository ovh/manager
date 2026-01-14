import React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { labels } from '@/test-utils/i18ntest.utils';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { ResourceStatus } from '@/types/Resource.type';

import { ResourceStatusCell } from '../ResourceStatusCell.component';

describe('ResourceStatusCell', () => {
  it('renders translated status and maps READY to success color', async () => {
    const wrapper = await testWrapperBuilder().withI18next().build();
    const vault = { ...mockVaults[0]!, resourceStatus: 'READY' as ResourceStatus };

    const { container } = render(<ResourceStatusCell resourceStatus={vault.resourceStatus} />, {
      wrapper,
    });

    const badge = container.querySelector('ods-badge')!;
    expect(badge.getAttribute('label')).toBe(labels.status.ready);
    expect(badge.getAttribute('color')).toBe('success');
  });

  it('maps ERROR to critical color', async () => {
    const wrapper = await testWrapperBuilder().withI18next().build();
    const vault = { ...mockVaults[0]!, resourceStatus: 'ERROR' as ResourceStatus };

    const { container } = render(<ResourceStatusCell resourceStatus={vault.resourceStatus} />, {
      wrapper,
    });

    const badge = container.querySelector('ods-badge')!;
    expect(badge.getAttribute('label')).toBe(labels.status.error);
    expect(badge.getAttribute('color')).toBe('critical');
  });
});
