import React from 'react';

import { waitFor } from '@testing-library/dom';
import { describe, expect } from 'vitest';

import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

import Redirections from './Redirections.page';

describe('Redirections page', () => {
  it('should display page correctly', async () => {
    const { getByTestId } = render(<Redirections />);

    await waitFor(() => {
      const button = getByTestId('add-redirection-btn');
      expect(button).toHaveAttribute('label', commonTranslation.add_redirection);
    });
  });
});
