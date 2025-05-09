import { vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@/utils/testProvider';
import Header from './Header';

type HeadersProps = {
  title: string;
  headerButton?: React.ReactNode;
  changelogButton?: React.ReactNode;
};

vi.mock('@ovh-ux/manager-react-components', () => ({
  Headers: ({ title, headerButton, changelogButton }: HeadersProps) => (
    <div>
      <div data-testid="headers">{title}</div>
      <div data-testid="header-button">{headerButton}</div>
      <div data-testid="changelog-button-wrapper">{changelogButton}</div>
    </div>
  ),
  ChangelogButton: () => (
    <button data-testid="changelog-button">Change-log</button>
  ),
}));

describe('Header', () => {
  it('should show title and changelog button', () => {
    const title = 'Titre de test';

    render(<Header title={title} />);

    expect(screen.getByTestId('headers')).toHaveTextContent(title);
    expect(screen.getByTestId('changelog-button')).toBeInTheDocument();
  });
});
