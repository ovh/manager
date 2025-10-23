import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormField } from '..';

describe('FormField Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(<FormField>Hello</FormField>);
    expect(container).toMatchSnapshot();
  });
});
