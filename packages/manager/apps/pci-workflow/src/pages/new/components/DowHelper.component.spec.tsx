import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { DowHelper } from './DowHelper.component';

describe('DowHelper Component', () => {
  it('renders DowHelper component successfully', () => {
    const { container } = render(<DowHelper />);
    expect(container).toBeDefined();
  });
});
