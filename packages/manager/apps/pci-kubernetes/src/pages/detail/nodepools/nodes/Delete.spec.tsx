import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { wrapper } from '@/wrapperRenders';
import DeletePage from './Delete.page';

describe('Delete', () => {
  it('should render correctly', () => {
    const { container } = render(<DeletePage />, { wrapper });

    expect(container).toMatchSnapshot();
  });
});
