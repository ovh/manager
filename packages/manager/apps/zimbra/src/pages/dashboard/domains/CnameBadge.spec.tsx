import React from 'react';
import { describe, expect } from 'vitest';
import { ResourceStatus } from '@/data/api';
import CnameBadge from './CnameBadge.component';
import { render } from '@/utils/test.provider';

describe('CnameBadge Component', () => {
  it('should render correctly', async () => {
    const { container } = render(
      <CnameBadge
        item={{
          id: '1',
          name: 'test-domain',
          organizationId: '1',
          organizationLabel: 'test-org',
          account: 0,
          status: ResourceStatus.CREATING,
          cnameToCheck: 'test-domain.cname.ovh',
        }}
      />,
    );

    expect(container).toBeVisible();
  });
});
