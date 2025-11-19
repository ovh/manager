import React from 'react';

import { waitFor } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import Aliases from './Aliases.page';

describe('Aliases page', () => {
  it('Page should display correctly', async () => {
    const { getByTestId } = render(<Aliases />);

    await waitFor(() => {
      expect(getByTestId('add-alias-btn')).toBeInTheDocument();
    });

    const button = getByTestId('add-alias-btn');

    expect(button).toHaveTextContent(commonTranslation.add_alias);
  });
});
