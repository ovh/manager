import React from 'react';

import { describe, expect } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test.provider';

import Aliases from './Aliases.page';

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
