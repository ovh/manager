import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Timepicker } from '..';

describe('Timepicker Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(<Timepicker>Hello</Timepicker>);
    expect(container).toMatchSnapshot();
  });
});
