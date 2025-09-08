import { render } from '@testing-library/react';
import { describe } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import NodesPage from '../pages/detail/nodepools/nodes/Nodes.page';

describe('NodesPage', () => {
  it('should render correctly', () => {
    const { container } = render(<NodesPage />, { wrapper });

    expect(container).toMatchSnapshot();
  });
});
