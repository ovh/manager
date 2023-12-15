import React from 'react';
import Onboarding from './index';

import { render, waitFor } from '../../utils/test.provider';

const setupSpecTest = async () => waitFor(() => render(<Onboarding />));

describe('Onboarding', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText('title');

    expect(title).not.toBeNull();
  });
});
