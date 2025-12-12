import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Guides from './Guides.component';

const userMock = { ovhSubsidiary: 'FR' };
vi.mock('@/hooks/useUser', () => ({
  useUser: () => userMock,
}));

const guideConfigMock = [
  {
    id: 'guide1',
    titleKey: 'title1',
    descriptionKey: 'desc1',
    linksByLocale: { FR: 'https://fr-guide', DEFAULT: 'https://default-guide' },
  },
  {
    id: 'guide2',
    titleKey: 'title2',
    linksByLocale: {
      FR: 'https://fr-guide2',
      DEFAULT: 'https://default-guide2',
    },
  },
];
vi.mock('./guides.config', () => ({
  resolveGuides: () => guideConfigMock,
}));

describe('Guides component', () => {
  it('renders the open button and opens the dialog on click', () => {
    render(<Guides />);
    const openBtn = screen.getByTestId('guide-open-button');
    expect(openBtn).toBeInTheDocument();
    fireEvent.click(openBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders guides sorted by title', () => {
    render(<Guides />);
    fireEvent.click(screen.getByTestId('guide-open-button'));
    const items = screen.getAllByRole('option');
    expect(items[0]).toHaveTextContent('title1');
    expect(items[1]).toHaveTextContent('title2');
  });

  it('falls back to DEFAULT url if locale not found', () => {
    vi.mock('@/hooks/useUser', () => ({
      useUser: () => ({ ovhSubsidiary: 'ZZ' }),
    }));
    render(<Guides />);
    fireEvent.click(screen.getByTestId('guide-open-button'));
    expect(screen.getByTestId('https://default-guide')).toBeInTheDocument();
  });
});
