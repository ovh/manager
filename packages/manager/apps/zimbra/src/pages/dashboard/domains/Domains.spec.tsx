import React from 'react';
import { describe, expect } from 'vitest';
import Domains from './Domains.page';
import { render, waitFor } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('Domains page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<Domains />);

    await waitFor(() => {
      expect(getByTestId('add-domain-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-domain-btn');
    expect(button).toHaveAttribute('label', commonTranslation.add_domain);

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});
