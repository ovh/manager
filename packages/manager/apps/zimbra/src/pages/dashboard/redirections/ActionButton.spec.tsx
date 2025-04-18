import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonRedirection from './ActionButton.component';
import { render } from '@/utils/test.provider';
import { FEATURE_FLAGS } from '@/utils';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { ResourceStatus } from '@/data/api';

describe('Redirections datagrid action menu', () => {
  it('renders with menu enabled and 2 items', () => {
    const { container } = render(
      <ActionButtonRedirection
        item={{
          id: '1',
          from: 'testFrom',
          to: 'testTo',
          organization: 'TestOrganization',
          status: ResourceStatus.READY,
        }}
      />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    if (FEATURE_FLAGS.REDIRECTIONS_EDIT) {
      expect(menuItems.length).toBe(2);
      expect(menuItems[0]).toHaveAttribute('label', commonTranslation.modify);
      expect(menuItems[1]).toHaveAttribute('label', commonTranslation.delete);
    } else {
      expect(menuItems.length).toBe(1);
      expect(menuItems[0]).toHaveAttribute('label', commonTranslation.delete);
    }
  });
});
