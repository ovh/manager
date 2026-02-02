import React from 'react';

import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import UpdateOffer from './UpdateOffer.page';

describe('Update offer account page', () => {
  it('should render page correctly', async () => {
    const { getByTestId, queryByTestId } = render(<UpdateOffer />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('update-offer-account-page')).toBeInTheDocument();
  });
});
