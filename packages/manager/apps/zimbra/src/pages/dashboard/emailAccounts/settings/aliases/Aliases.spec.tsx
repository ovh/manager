import React from 'react';
import { describe, expect } from 'vitest';
import Aliases from './Aliases.page';
import { render, waitFor } from '@/utils/test.provider';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('Aliases page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<Aliases />);

    await waitFor(() => {
      expect(getByTestId('add-alias-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-alias-btn');

    expect(button).toHaveAttribute('label', commonTranslation.add_alias);

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});
