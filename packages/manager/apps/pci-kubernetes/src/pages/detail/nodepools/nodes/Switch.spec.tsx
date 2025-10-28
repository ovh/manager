import { render } from '@testing-library/react';
import { describe } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import SwitchPage from './Switch.page';

describe('SwitchPage', () => {
  it('should render correctly', () => {
    const { container } = render(<SwitchPage />, { wrapper });

    expect(container).toMatchSnapshot();
  });
});
