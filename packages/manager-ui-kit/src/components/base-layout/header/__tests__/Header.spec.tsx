import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header.component';

describe('Header Component', () => {
  const defaultProps = {
    title: 'Page Title',
    guideMenu: <button>Guide</button>,
    changelogButton: <button>Changelog</button>,
  };

  it('renders title correctly', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('does not render title if not provided', () => {
    render(<Header {...defaultProps} title={undefined} />);
    expect(screen.queryByTestId('title')).not.toBeInTheDocument();
  });

  it('renders both buttons when provided', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('Guide')).toBeInTheDocument();
    expect(screen.getByText('Changelog')).toBeInTheDocument();
  });

  it('does not render buttons when both are not provided', () => {
    render(
      <Header
        {...defaultProps}
        guideMenu={undefined}
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

  it('renders only guide button when only guideMenu is provided', () => {
    render(<Header {...defaultProps} changelogButton={undefined} />);
    expect(screen.getByText('Guide')).toBeInTheDocument();
    expect(screen.queryByText('Changelog')).not.toBeInTheDocument();
  });

  it('renders only changelog button when only changelogButton is provided', () => {
    render(<Header {...defaultProps} guideMenu={undefined} />);
    expect(screen.getByText('Changelog')).toBeInTheDocument();
    expect(screen.queryByText('Guide')).not.toBeInTheDocument();
  });
});
