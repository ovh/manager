import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonOrganization from './ActionButton.component';
import { render } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { ResourceStatus } from '@/data/api';

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

    expect(menuItems[0]).toHaveAttribute('label', commonTranslation.modify);

    expect(menuItems[1]).toHaveAttribute('label', commonTranslation.delete);
  });
});
