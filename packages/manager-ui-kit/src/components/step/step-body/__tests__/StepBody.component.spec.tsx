import React from 'react';
import { vitest, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StepBody from '../StepBody.component';
import { StepContext } from '../../StepContext';

// Mocking Suspense fallback to avoid rendering real spinner
vitest.mock('@ovhcloud/ods-react', () => ({
  Spinner: vitest.fn(() => <div data-testid="spinner" />),
  SPINNER_SIZE: { md: 'md' },
}));

describe('StepBody Component', () => {
  const renderWithStepContext = (value, children: JSX.Element | string) =>
    render(
      <StepContext.Provider value={value}>
        <StepBody>{<div data-testid="children">{children}</div>}</StepBody>
      </StepContext.Provider>,
    );

  it('renders the subtitle when provided', () => {
    renderWithStepContext(
      { subtitle: 'This is a subtitle', locked: false },
      'Step Content',
    );
    expect(screen.getByText(/This is a subtitle/i)).toBeInTheDocument();
  });

  it('does not render the subtitle when not provided', () => {
    renderWithStepContext({ subtitle: '', locked: false }, 'Step Content');
    expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument();
  });

  it('renders the children content', () => {
    renderWithStepContext({ subtitle: '', locked: false }, 'Step Content');
    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  it('disables interaction with body when locked is true', () => {
    renderWithStepContext({ subtitle: '', locked: true }, 'Step Content');
    expect(screen.getByTestId('content')).toHaveClass(
      'mt-5 cursor-not-allowed pointer-events-none opacity-50',
    );
  });

  it('enables the interaction with body when locked is false', () => {
    renderWithStepContext({ subtitle: '', locked: false }, 'Step Content');
    expect(screen.getByTestId('content')).toHaveClass('mt-5');
    expect(screen.getByTestId('content')).not.toHaveClass(
      'cursor-not-allowed pointer-events-none opacity-50',
    );
  });
});
