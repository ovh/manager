import React from 'react';

import { describe, expect } from 'vitest';

import { ResourceStatus } from '@/data/api';
import { render } from '@/utils/test.provider';

import ActionButtonOrganization from './ActionButton.component';

describe('Organizations datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonOrganization
        item={{
          id: '1',
          name: 'test',
          label: 'testLabel',
          account: 1,
          status: ResourceStatus.READY,
        }}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(2);

    expect(menuItems[0]).toHaveAttribute('label', 'modify');

    expect(menuItems[1]).toHaveAttribute('label', 'delete');
  });
});
