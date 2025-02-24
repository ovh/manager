import { vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@/utils/testProvider';
import Header from './Header';

vi.mock('@ovh-ux/manager-react-components', () => ({
  Headers: ({ title }: { title: string }) => (
    <div data-testid="headers">{title}</div>
  ),
  PciGuidesHeader: ({ category }: { category: string }) => (
    <div data-testid="pci-guides-header">{category}</div>
  ),
}));

describe('Header', () => {
  it('should show title and category', () => {
    const title = 'Titre de test';
    const category = 'savings_plans_test';

    render(<Header title={title} category={category} />);

    expect(screen.getByTestId('headers')).toHaveTextContent(title);
    expect(screen.getByTestId('pci-guides-header')).toHaveTextContent(category);
  });
});
