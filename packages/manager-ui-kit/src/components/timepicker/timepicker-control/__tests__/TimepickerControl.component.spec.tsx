import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimepickerControl } from '@/components';

describe('TimepickerControl', () => {
  it('renders the component with default props', () => {
    const { container } = render(<TimepickerControl />);
    expect(container).toBeTruthy();
  });
});
