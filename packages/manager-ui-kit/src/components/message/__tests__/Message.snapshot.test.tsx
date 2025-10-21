import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Message } from '..';

describe('Message Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(<Message>Hello</Message>);
    expect(container).toMatchSnapshot();
  });
});
