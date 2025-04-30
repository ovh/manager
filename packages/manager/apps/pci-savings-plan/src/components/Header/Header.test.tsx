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
  PciGuidesHeader: ({ category }: { category: string }) => (
    <div data-testid="pci-guides-header">{category}</div>
  ),
  ChangelogButton: () => (
    <button data-testid="changelog-button">Change-log</button>
  ),
}));

describe('Header', () => {
  it('should show title, category and changelog button', () => {
    const title = 'Titre de test';
    const category = 'savings_plans_test';

    render(<Header title={title} category={category} />);

    expect(screen.getByTestId('headers')).toHaveTextContent(title);
    expect(screen.getByTestId('pci-guides-header')).toHaveTextContent(category);
    expect(screen.getByTestId('changelog-button')).toBeInTheDocument();
  });
});
