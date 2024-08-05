import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import RestrictionLine from '@/components/restriction/RestrictionLine.component';

describe('RestrictionLine', () => {
  it('renders input field with initial IP value', () => {
    const { getByText } = render(
      <RestrictionLine
        ip="192.168.1.1"
        ipIndex={0}
        onSave={vi.fn()}
        onDelete={vi.fn()}
        onClose={vi.fn()}
        disabled={false}
      />,
    );
    expect(getByText('192.168.1.1')).toBeInTheDocument();
  });
});
