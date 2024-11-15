import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonDomain from '../ActionButtonDomain.component';
import { render } from '@/utils/test.provider';
import domainTranslation from '@/public/translations/domains/Messages_fr_FR.json';
import { domainDetailMock } from '@/api/_mock_';

describe('Domains datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonDomain domainItem={domainDetailMock} />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(2);

    expect(menuItems[0]).toHaveAttribute(
      'label',
      domainTranslation.zimbra_domains_tooltip_configure,
    );

    expect(menuItems[1]).toHaveAttribute(
      'label',
      domainTranslation.zimbra_domains_tooltip_delete,
    );
  });
});
