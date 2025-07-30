/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { mockBottomSectionItem } from '@/data/__mocks__';

import StandardItem from './StandardItem.component';

describe('StandardItem', () => {
  it('renders item information', () => {
    render(<StandardItem item={mockBottomSectionItem} />);
    expect(screen.getByText(mockBottomSectionItem.label)).toBeInTheDocument();
    expect(screen.getByTestId('ods-link')).toHaveAttribute(
      'href',
      mockBottomSectionItem.link,
    );
  });
});
