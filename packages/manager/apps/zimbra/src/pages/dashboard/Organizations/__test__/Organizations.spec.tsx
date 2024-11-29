import React from 'react';
import { describe, expect } from 'vitest';
import Organizations from '../Organizations';
import { render, waitFor } from '@/utils/test.provider';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';

describe('Organizations page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<Organizations />);

    await waitFor(() => {
      expect(getByTestId('add-organization-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-organization-btn');

    expect(button).toHaveAttribute(
      'label',
      organizationsTranslation.add_organisation_cta,
    );

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});
