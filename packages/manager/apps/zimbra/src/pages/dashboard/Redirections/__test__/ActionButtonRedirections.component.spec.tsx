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

    if (FEATURE_FLAGS.REDIRECTIONS_EDIT) {
      expect(container.querySelectorAll('osds-menu-item').length).toBe(2);

      expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
        redirectionsTranslation.zimbra_redirections_datagrid_tooltip_modification,
      );

      expect(container.querySelectorAll('osds-menu-item')[1]).toHaveTextContent(
        redirectionsTranslation.zimbra_redirections_datagrid_tooltip_delete,
      );
    } else {
      expect(container.querySelectorAll('osds-menu-item').length).toBe(1);

      expect(container.querySelectorAll('osds-menu-item')[0]).toHaveTextContent(
        redirectionsTranslation.zimbra_redirections_datagrid_tooltip_delete,
      );
    }
  });
});
