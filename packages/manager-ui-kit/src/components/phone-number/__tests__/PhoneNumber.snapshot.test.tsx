import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PhoneNumber } from '..';

describe('PhoneNumber Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(<PhoneNumber>Hello</PhoneNumber>);
    expect(container).toMatchSnapshot();
  });
});
