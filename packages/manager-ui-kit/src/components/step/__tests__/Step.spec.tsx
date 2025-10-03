import React from 'react';
import { expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Step } from '../Step.component';
import { StepContext } from '../StepContext';

// Step component only handles the visibility of child components depending on conditions
// And to test different conditions, mocks provide an easy way of identification with testid
vitest.mock('../step-indicator/StepIndicator.component', () => ({
  StepIndicator: () => <div data-testid="step-indicator" />,
}));
vitest.mock('../step-header/StepHeader.component', () => ({
  StepHeader: () => <div data-testid="step-header" />,
}));
vitest.mock('../step-body/StepBody.component', () => ({
  StepBody: ({ children }) => <div data-testid="step-body">{children}</div>,
}));
vitest.mock('../step-footer/StepFooter.component', () => ({
  StepFooter: () => <div data-testid="step-footer" />,
}));

describe('Step Component', () => {
  const defaultProps = {
    id: 'test-id',
    title: 'Test Step',
    subtitle: 'This is a test step',
    open: false,
    checked: false,
    locked: false,
    order: 1,
    children: <p>Step Content</p>,
    next: null,
    edit: null,
    skip: null,
  };

  it('renders the step indicator', () => {
    render(<Step {...defaultProps} />);
    expect(screen.getByTestId('step-indicator')).toBeInTheDocument();
  });

  it('renders the step header', () => {
    render(<Step {...defaultProps} />);
    expect(screen.getByTestId('step-header')).toBeInTheDocument();
  });

  it('renders the step body and footer when open is true and locked is false', () => {
    render(<Step {...defaultProps} open={true} locked={false} />);
    expect(screen.getByTestId('step-body')).toBeInTheDocument();
    expect(screen.getByTestId('step-footer')).toBeInTheDocument();
  });

  it('does not render the step body or footer when open is false', () => {
    render(<Step {...defaultProps} open={false} />);
    expect(screen.queryByTestId('step-body')).not.toBeInTheDocument();
    expect(screen.queryByTestId('step-footer')).not.toBeInTheDocument();
  });

  it('does not render the step footer when locked is true', () => {
    render(<Step {...defaultProps} open={true} locked={true} />);
    expect(screen.queryByTestId('step-footer')).not.toBeInTheDocument();
  });

  it('provides correct context values to children', () => {
    render(
      <Step {...defaultProps} open={true}>
        <StepContext.Consumer>
          {(context) => (
            <div data-testid="context-values">
              {context.id === defaultProps.id &&
              context.title === defaultProps.title &&
              context.subtitle === defaultProps.subtitle &&
              context.open === true &&
              context.checked === defaultProps.checked &&
              context.locked === defaultProps.locked &&
              context.order === defaultProps.order &&
              context.next === defaultProps.next &&
              context.edit === defaultProps.edit &&
              context.skip === defaultProps.skip
                ? 'Context is correct'
                : 'Context is incorrect'}
            </div>
          )}
        </StepContext.Consumer>
      </Step>,
    );

    expect(screen.getByTestId('context-values')).toHaveTextContent(
      'Context is correct',
    );
  });
});
