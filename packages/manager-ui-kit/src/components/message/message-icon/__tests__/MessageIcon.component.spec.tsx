import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MessageIcon } from '@/components';

describe('MessageIcon', () => {
  it('renders the component with default props', () => {
    const { container } = render(<MessageIcon name={undefined} />);
    expect(container).toBeTruthy();
  });
});
