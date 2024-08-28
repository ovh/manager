import { vitest } from 'vitest';
import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { Clipboard } from './clipboard.component';
import { regular } from './clipboard.stories';

const setupSpecTest = async () =>
  waitFor(() => render(<Clipboard value={regular.args.value} />));

describe('Clipboard', () => {
  it('should render value', async () => {
    const { getByTestId } = await setupSpecTest();
    const clipboard = getByTestId('clipboard');
    expect(clipboard).toHaveValue(regular.args.value);
  });
});
