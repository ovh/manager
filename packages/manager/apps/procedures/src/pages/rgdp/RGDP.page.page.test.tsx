import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { useTranslation } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import RGDP from './RGDP.page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: vi.fn((key) => key),
  }),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OsdsText: ({ children, color, level, size, className }: any) => (
    <div data-testid="osds-text" color={color} className={className}>
      {children}
    </div>
  ),
}));

describe('RGDP Component', () => {
  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <RGDP />
      </MemoryRouter>,
    );

    const titleElement = screen.getByText('rgdp-title');
    expect(titleElement).toBeInTheDocument();
  });
});
