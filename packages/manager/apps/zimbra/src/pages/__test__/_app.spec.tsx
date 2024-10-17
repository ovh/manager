import React from 'react';
import { describe, expect } from 'vitest';
import App from '../_app';
import { render } from '@/utils/test.provider';

describe('App', () => {
  it('should render correctly', async () => {
    const { getByTestId } = render(
      <App>
        <div data-testid="test"></div>
      </App>,
    );

    expect(getByTestId('test')).toBeVisible();
  });
});
