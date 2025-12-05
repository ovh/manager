import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { wrapper } from '@/utils/test.provider';

import Loading from '../Loading.component';

describe('Loading component', () => {
  it('should render loading component', () => {
    const { getByTestId } = render(<Loading />, { wrapper });
    const container = getByTestId('spinner');
    expect(container).toBeVisible();
  });
});
