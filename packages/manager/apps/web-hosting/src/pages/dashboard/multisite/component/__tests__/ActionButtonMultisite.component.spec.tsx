import React from 'react';

import { describe, expect, it, vi } from 'vitest';

import { WebHostingWebsiteDomainMocks } from '@/data/__mocks__';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import ActionButtonMultisite from '../ActionButtonMultisite.component';

describe('ActionButtonMultisite component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render site actions correctly', () => {
    const { container } = render(<ActionButtonMultisite context="site" siteId={'1'} path="www" />);

    expect(container).toBeInTheDocument();

    const menuItems = container.querySelectorAll('ods-popover ods-button');
    expect(menuItems.length).toBeGreaterThan(1);

    const labels = Array.from(menuItems).map((el) => el.getAttribute('label'));
    expect(labels).toContain(commonTranslation.add_domain);
  });

  it('should navigate correctly when clicking a site action', () => {
    const { container } = render(<ActionButtonMultisite context="site" siteId={'1'} path="www" />);
    const addDomainButton = container.querySelector('ods-button[label="Ajouter un domaine"]');
    expect(addDomainButton).toBeInTheDocument();

    addDomainButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it('should render domain actions correctly', () => {
    const { container } = render(
      <ActionButtonMultisite
        context="domain"
        domainId={'1'}
        domain="test.site"
        domains={WebHostingWebsiteDomainMocks}
      />,
    );

    expect(container).toBeInTheDocument();

    const menuItems = container.querySelectorAll('ods-popover ods-button');
    expect(menuItems.length).toBeGreaterThan(1);

    const labels = Array.from(menuItems).map((el) => el.getAttribute('label'));
    expect(labels).toContain(commonTranslation.modify_domain);
  });
});
