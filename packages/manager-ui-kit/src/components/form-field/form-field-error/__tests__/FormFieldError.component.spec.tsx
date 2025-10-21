import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormFieldError } from '@/components';

describe('FormFieldError', () => {
  it('renders the component with default props', () => {
    const { container } = render(<FormFieldError />);
    expect(container).toBeTruthy();
  });
});
