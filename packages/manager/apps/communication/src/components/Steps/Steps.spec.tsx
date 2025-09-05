import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Steps from './Steps.component';
import { Step } from './steps.type';

const mockedSteps: Step[] = [
  {
    children: 'Step 1',
    isActive: true,
  },
  {
    children: <>Step 2</>,
  },
];

describe('Steps.component', () => {
  it('should render a list of steps correctly', () => {
    const { container } = render(<Steps steps={mockedSteps} />);
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('li')[0]).toHaveClass('step-active');
  });
});
