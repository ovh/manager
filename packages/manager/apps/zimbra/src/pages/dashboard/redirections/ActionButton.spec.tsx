import React from 'react';

import { describe, expect } from 'vitest';

import actionsCommonTranslation from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { ResourceStatus } from '@/data/api';
import { FEATURE_FLAGS } from '@/utils';
import { render } from '@/utils/test.provider';

import ActionButtonRedirection from './ActionButton.component';

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
      expect(menuItems[0]).toHaveAttribute('label', actionsCommonTranslation.modify);
      expect(menuItems[1]).toHaveAttribute('label', actionsCommonTranslation.delete);
    } else {
      expect(menuItems.length).toBe(1);
      expect(menuItems[0]).toHaveAttribute('label', actionsCommonTranslation.delete);
    }
  });
});
