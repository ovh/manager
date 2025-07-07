import { expect, it, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Step } from '../Step.component';

describe('Step Component - Snapshot Tests', () => {
  const defaultProps = {
    id: 'test-id',
    title: 'Test Step',
    subtitle: 'This is a test step',
    open: true,
    checked: false,
    locked: false,
    order: 1,
    children: <p>Step Content</p>,
    next: null,
    edit: null,
    skip: null,
  };

  it('renders the Step with Title and Subtitle', () => {
    const { container } = render(<Step {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the checked and locked Step', () => {
    const { container } = render(
      <Step {...defaultProps} checked={true} locked={true}>
        <>Test Body</>
      </Step>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the Step with Next button enabled', () => {
    const { container } = render(
      <Step
        {...defaultProps}
        next={{
          label: 'Next Step',
          action: vitest.fn(),
          disabled: false,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the Step with Next button disabled', () => {
    const { container } = render(
      <Step
        {...defaultProps}
        next={{
          label: 'Next Step',
          action: vitest.fn(),
          disabled: true,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the Step with Skip button', () => {
    const { container } = render(
      <Step
        {...defaultProps}
        skip={{
          label: 'Skip this step',
          action: vitest.fn(),
          disabled: false,
          hint: '(Optional)',
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the Step with Skip button disabled', () => {
    const { container } = render(
      <Step
        {...defaultProps}
        skip={{
          label: 'Skip this step',
          action: vitest.fn(),
          disabled: true,
          hint: '(Optional)',
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the Step with Edit Button', () => {
    const { container } = render(
      <Step
        {...defaultProps}
        checked={true}
        edit={{
          label: 'Edit',
          action: vitest.fn(),
          disabled: false,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the Step with Edit Button disabled', () => {
    const { container } = render(
      <Step
        {...defaultProps}
        checked={true}
        edit={{
          label: 'Edit',
          action: vitest.fn(),
          disabled: true,
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the closed Step', () => {
    const { container } = render(
      <Step {...defaultProps} open={false} locked={true} checked={true} />,
    );
    expect(container).toMatchSnapshot();
  });
});
