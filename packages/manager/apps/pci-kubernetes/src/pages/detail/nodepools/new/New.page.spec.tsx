import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { wrapper } from '@/wrapperRenders';
import NewPage from './New.page';

describe('New', () => {
  it('should render correctly', () => {
    const { container } = render(<NewPage />, { wrapper });

    expect(container).toMatchSnapshot();
  });
});
