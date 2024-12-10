import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonRedirections from '../ActionButtonRedirections.component';
import { render } from '@/utils/test.provider';
import { FEATURE_FLAGS } from '@/utils';
import redirectionsTranslation from '@/public/translations/redirections/Messages_fr_FR.json';
import { ResourceStatus } from '@/api/api.type';

describe('Redirections datagrid action menu', () => {
  it('renders with menu enabled and 2 items', () => {
    const { container } = render(
      <ActionButtonRedirections
        redirectionsItem={{
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

      expect(menuItems[0]).toHaveAttribute(
        'label',
        redirectionsTranslation.zimbra_redirections_datagrid_tooltip_modification,
      );

      expect(menuItems[1]).toHaveAttribute(
        'label',
        redirectionsTranslation.zimbra_redirections_datagrid_tooltip_delete,
      );
    } else {
      expect(menuItems.length).toBe(1);

      expect(menuItems[0]).toHaveAttribute(
        'label',
        redirectionsTranslation.zimbra_redirections_datagrid_tooltip_delete,
      );
    }
  });
});
