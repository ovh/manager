import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FileUpload } from '..';

describe('FileUpload Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(<FileUpload>Hello</FileUpload>);
    expect(container).toMatchSnapshot();
  });
});
