import React from 'react';
import { render, screen } from '@testing-library/react';
import Tab2 from './Tab2';

describe('Tab2', () => {
  it('renders the correct text', () => {
    render(<Tab2 />);
    const tab2Element = screen.getByText('Tab 2');
    expect(tab2Element).toBeInTheDocument();
  });
});
