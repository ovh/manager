import React from 'react';

import { describe, expect } from 'vitest';

import { ResourceStatus } from '@/data/api';
import { render } from '@/utils/test.provider';

import CnameBadge from './CnameBadge.component';

describe('CnameBadge Component', () => {
  it('should render correctly', () => {
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
