import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TreeViewNodes } from '@/components';

describe('TreeViewNodes', () => {
  it('renders the component with default props', () => {
    const { container } = render(<TreeViewNodes />);
    expect(container).toBeTruthy();
  });
});
