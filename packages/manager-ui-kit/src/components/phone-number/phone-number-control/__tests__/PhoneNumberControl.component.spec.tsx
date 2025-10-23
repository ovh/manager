import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PhoneNumberControl } from '@/components';

describe('PhoneNumberControl', () => {
  it('renders the component with default props', () => {
    const { container } = render(<PhoneNumberControl />);
    expect(container).toBeTruthy();
  });
});
