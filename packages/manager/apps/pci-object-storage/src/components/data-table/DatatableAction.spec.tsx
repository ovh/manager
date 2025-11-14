import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatatableAction } from './DatatableAction.component';

describe('DatatableAction', () => {
  it('renders children when provided', () => {
    render(
      <DatatableAction>
        <span data-testid="child">Hello</span>
      </DatatableAction>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('renders nothing when children is undefined', () => {
    const { container } = render(
      <DatatableAction>{undefined}</DatatableAction>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when children is null', () => {
    const { container } = render(<DatatableAction>{null}</DatatableAction>);
    expect(container).toBeEmptyDOMElement();
  });
});
