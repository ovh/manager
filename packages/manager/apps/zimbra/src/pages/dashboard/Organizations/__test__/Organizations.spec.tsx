import React from 'react';
import { vi, describe, expect } from 'vitest';
import Organizations from '../Organizations';
import { render, waitFor } from '@/utils/test.provider';
import organizationsTranslation from '@/public/translations/organizations/Messages_fr_FR.json';
import { useGenerateUrl } from '@/hooks';

const addUrl = '#/00000000-0000-0000-0000-000000000001/organizations/add?';

describe('Organizations page', () => {
  it('Page should display correctly', async () => {
    vi.mocked(useGenerateUrl).mockReturnValue(addUrl);
    const { getByTestId } = render(<Organizations />);

    await waitFor(() => {
      expect(getByTestId('add-organization-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-organization-btn');
    expect(button).toHaveAttribute('href', addUrl);
    expect(button).toHaveTextContent(
      organizationsTranslation.add_organisation_cta,
    );
  });
});
