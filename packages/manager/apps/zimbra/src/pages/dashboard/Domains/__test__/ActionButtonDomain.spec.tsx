import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonDomain from '../ActionButtonDomain.component';
import { render } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { domainDetailMock } from '@/api/_mock_';

describe('Domains datagrid action menu', () => {
  it('we have good number of item with good content', () => {
    const { container } = render(
      <ActionButtonDomain domainItem={domainDetailMock} />,
    );

    const menuItems = container.querySelectorAll('ods-popover ods-button');

    expect(menuItems.length).toBe(3);

    expect(menuItems[0]).toHaveAttribute('label', commonTranslation.configure);

    expect(menuItems[1]).toHaveAttribute(
      'label',
      commonTranslation.diagnostics,
    );

    expect(menuItems[2]).toHaveAttribute('label', commonTranslation.delete);
  });
});
