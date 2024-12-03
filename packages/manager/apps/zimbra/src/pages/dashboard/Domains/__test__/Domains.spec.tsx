import React from 'react';
import { describe, expect } from 'vitest';
import Domains from '../Domains';
import { render, waitFor } from '@/utils/test.provider';
import domainTranslation from '@/public/translations/domains/Messages_fr_FR.json';

describe('Domains page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<Domains />);

    await waitFor(() => {
      expect(getByTestId('add-domain-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-domain-btn');
    expect(button).toHaveAttribute(
      'label',
      domainTranslation.zimbra_domains_add_domain_title,
    );

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});
