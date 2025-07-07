import { render, screen } from '@testing-library/react';
import FullPageSpinner from './FullPageSpinner';

describe('FullPageSpinner', () => {
  it('should render the spinner with default props', () => {
    render(<FullPageSpinner />);
    const container = screen.getByTestId('full-page-spinner');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('should apply a custom data-testid', () => {
    render(<FullPageSpinner data-testid="custom-spinner" />);
    expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
  });

  it('should apply a custom className', () => {
    render(<FullPageSpinner className="my-custom-class" />);
    const container = screen.getByTestId('full-page-spinner');
    expect(container.className).toMatch(/my-custom-class/);
  });

  it('should pass props to the container', () => {
    render(<FullPageSpinner aria-label="Loading..." />);
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('should pass spinnerProps to OdsSpinner', () => {
    render(<FullPageSpinner spinnerProps={{ size: 'lg' }} />);
    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('should have role="alert" and aria-busy="true"', () => {
    render(<FullPageSpinner />);
    const container = screen.getByTestId('full-page-spinner');
    expect(container).toHaveAttribute('role', 'alert');
    expect(container).toHaveAttribute('aria-busy', 'true');
  });

  it('should merge custom className with defaults', () => {
    render(<FullPageSpinner className="foo" />);
    const container = screen.getByTestId('full-page-spinner');
    expect(container.className).toMatch(/flex/);
    expect(container.className).toMatch(/foo/);
  });
});
