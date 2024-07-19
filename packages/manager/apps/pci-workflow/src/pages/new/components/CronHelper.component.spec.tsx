import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { CronHelper } from './CronHelper.component';

describe('CronHelper Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<CronHelper />);
    expect(container).toBeDefined();
  });
});
