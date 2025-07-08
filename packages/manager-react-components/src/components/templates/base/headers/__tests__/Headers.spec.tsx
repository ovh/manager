import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Headers from '../Headers.component';

describe('Headers Component', () => {
  const defaultProps = {
    title: 'Page Title',
    guideButton: <button>Guide</button>,
    changelogButton: <button>Changelog</button>,
  };

  it('renders title correctly', () => {
    render(<Headers {...defaultProps} />);

    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('does not render title if not provided', () => {
    render(<Headers {...defaultProps} title={undefined} />);
    expect(screen.queryByTestId('title')).not.toBeInTheDocument();
  });

  it('renders both buttons when provided', () => {
    render(<Headers {...defaultProps} />);
    expect(screen.getByText('Guide')).toBeInTheDocument();
    expect(screen.getByText('Changelog')).toBeInTheDocument();
  });

  it('does not render buttons when both are not provided', () => {
    render(
      <Headers
        {...defaultProps}
        guideButton={undefined}
        changelogButton={undefined}
      />,
    );
    expect(
      screen.queryByRole('button', { name: /Guide/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Changelog/i }),
    ).not.toBeInTheDocument();
  });

  it('renders only guide button when only guideButton is provided', () => {
    render(<Headers {...defaultProps} changelogButton={undefined} />);
    expect(screen.getByText('Guide')).toBeInTheDocument();
    expect(screen.queryByText('Changelog')).not.toBeInTheDocument();
  });

  it('renders only changelog button when only changelogButton is provided', () => {
    render(<Headers {...defaultProps} guideButton={undefined} />);
    expect(screen.getByText('Changelog')).toBeInTheDocument();
    expect(screen.queryByText('Guide')).not.toBeInTheDocument();
  });
});
