import { render } from '@testing-library/react';
import { describe } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import ScalePage from '../pages/detail/nodepools/Scale.page';

describe('Scale', () => {
  it('should render correctly', () => {
    const { container } = render(<ScalePage />, { wrapper });

    expect(container).toMatchSnapshot();
  });
});
