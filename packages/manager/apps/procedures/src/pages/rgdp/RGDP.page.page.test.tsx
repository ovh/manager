import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import RGDP from './RGDP.page';

vi.mock('./rgdpIntroduction/RGDPIntroduction.component', () => ({
  RGDPIntroduction: () => <div>RGDPIntroduction</div>,
}));

describe('RGDP Component', () => {
  it('renders the component correctly', () => {
    render(<RGDP />);

    const introductionElement = screen.getByText('RGDPIntroduction');
    expect(introductionElement).toBeInTheDocument();
  });
});
