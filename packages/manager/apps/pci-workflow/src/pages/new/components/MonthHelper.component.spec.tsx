import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MonthHelper } from './MonthHelper.component';

describe('MonthHelper Component', () => {
  it('renders MonthHelper component successfully', () => {
    const { container } = render(<MonthHelper />);
    expect(container).toBeDefined();
  });
});
