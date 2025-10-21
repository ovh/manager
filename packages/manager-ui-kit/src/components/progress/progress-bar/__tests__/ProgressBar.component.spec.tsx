import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from '@/components';

describe('ProgressBar', () => {
  it('renders the component with default props', () => {
    const { container } = render(<ProgressBar />);
    expect(container).toBeTruthy();
  });
});
