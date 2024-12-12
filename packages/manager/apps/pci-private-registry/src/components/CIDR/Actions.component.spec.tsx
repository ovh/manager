import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ActionComponent from './Actions.component';
import { TIPRestrictionsData } from '@/types';

// Mock DeleteModal
vi.mock('./DeleteModal.component', () => ({
  default: ({ cidr }) => (
    <div data-testid="delete-modal">Delete Modal for {cidr}</div>
  ),
}));

describe('ActionComponent', () => {
  it('renders ActionMenu with the correct item', () => {
    const cidr = ('192.168.0.1/24' as unknown) as TIPRestrictionsData;

    render(<ActionComponent cidr={cidr} />);

    // Check if the ActionMenu is rendered
    expect(
      screen.getByText('ip_restrictions_delete_block'),
    ).toBeInTheDocument();
  });

  it('opens DeleteModal when the action item is clicked', () => {
    const cidr = ('192.168.0.1/24' as unknown) as TIPRestrictionsData;

    render(<ActionComponent cidr={cidr} />);

    // Check that the DeleteModal is not rendered initially
    expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();

    // Click the action menu item
    fireEvent.click(screen.getByText('ip_restrictions_delete_block'));

    // Check if the DeleteModal is rendered
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    expect(screen.getByTestId('delete-modal')).toHaveTextContent(
      `Delete Modal for ${cidr}`,
    );
  });
});
