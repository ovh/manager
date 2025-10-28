import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MessageBody } from '@/components';

describe('MessageBody', () => {
  it('renders the component with default props', () => {
    const { container } = render(<MessageBody />);
    expect(container).toBeTruthy();
  });
});
