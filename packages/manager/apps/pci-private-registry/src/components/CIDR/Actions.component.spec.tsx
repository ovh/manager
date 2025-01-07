import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ActionComponent from './Actions.component';
import { TIPRestrictionsData } from '@/types';

describe('ActionComponent', () => {
  it('renders ActionMenu with the correct item', () => {
    const cidr = ({
      ipBlock: '192.168.0.1/24',
    } as unknown) as TIPRestrictionsData;

    render(<ActionComponent cidr={cidr} />);

    expect(
      screen.getByText('ip_restrictions_delete_block'),
    ).toBeInTheDocument();
  });

  it('opens DeleteModal when the action item is clicked', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    const cidr = ({
      ipBlock: '192.168.0.1/24',
      authorization: ['management'],
    } as unknown) as TIPRestrictionsData;

    render(<ActionComponent cidr={cidr} />);

    // Click the action menu item
    fireEvent.click(screen.getByText('ip_restrictions_delete_block'));
    expect(mockNavigate).toHaveBeenCalledWith('./delete', {
      state: {
        cidr: {
          management: [
            {
              description: undefined,
              ipBlock: '192.168.0.1/24',
            },
          ],
          registry: [],
        },
      },
    });
  });
});
