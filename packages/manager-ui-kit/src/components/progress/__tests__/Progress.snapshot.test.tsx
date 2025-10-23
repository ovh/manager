import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from '..';

describe('Progress Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(<Progress />);
    expect(container).toMatchSnapshot();
  });
});
