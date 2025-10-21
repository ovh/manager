import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormFieldLabel } from '@/components';

describe('FormFieldLabel', () => {
  it('renders the component with default props', () => {
    const { container } = render(<FormFieldLabel />);
    expect(container).toBeTruthy();
  });
});
