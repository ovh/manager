import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from '@/components';

describe('Skeleton Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(<Skeleton />);
    expect(container).toMatchSnapshot();
  });
});
