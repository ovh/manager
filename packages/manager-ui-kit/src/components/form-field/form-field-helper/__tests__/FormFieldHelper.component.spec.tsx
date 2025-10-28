import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormFieldHelper } from '@/components';

describe('FormFieldHelper', () => {
  it('renders the component with default props', () => {
    const { container } = render(<FormFieldHelper />);
    expect(container).toBeTruthy();
  });
});
