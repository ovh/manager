import React from 'react';
import { vi, describe, expect } from 'vitest';
import Domains from '../Domains';
import { render, waitFor } from '@/utils/test.provider';
import domainTranslation from '@/public/translations/domains/Messages_fr_FR.json';
import { useGenerateUrl } from '@/hooks';

const addUrl = '#/00000000-0000-0000-0000-000000000001/domains/add?';

describe('Domains page', () => {
  it('Page should display correctly', async () => {
    vi.mocked(useGenerateUrl).mockReturnValue(addUrl);
    const { getByTestId } = render(<Domains />);

    await waitFor(() => {
      expect(getByTestId('add-domain-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-domain-btn');
    expect(button).toHaveAttribute('href', addUrl);
    expect(button).toHaveTextContent(
      domainTranslation.zimbra_domains_add_domain_title,
    );
  });
});
