import { render, screen, fireEvent } from '@testing-library/react';

import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, Mock } from 'vitest';
import ActionComponent from './Actions.component';
import { TIPRestrictionsData } from '@/types';
import * as useDataGridContext from '@/pages/CIDR/useDatagridContext';
import { ContextDatagridType } from '@/pages/CIDR/DatagridContext.provider';

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn().mockReturnValue({ reset: vi.fn() }),
}));

vi.mock('@/pages/CIDR/useDatagridContext', async () => ({
  __esModule: true,
  default: () => ({
    editActualRow: vi.fn(),
    isDraft: false,
  }),
}));
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

  it('calls reset with the correct data when edit action is clicked', () => {
    const mockReset = vi.fn();
    const mockEditActualRow = vi.fn();

    vi.mocked(useFormContext as Mock).mockReturnValue({
      reset: mockReset,
    });

    mockEditActualRow.mockReturnValue({ ipBlock: '192.168.0.1/24' });
    vi.spyOn(useDataGridContext, 'default').mockImplementation(
      () =>
        (({
          editActualRow: mockEditActualRow,
          isDraft: false,
        } as unknown) as ContextDatagridType<TIPRestrictionsData[]>),
    );
    const cidr = {
      ipBlock: '192.168.0.1/24',
    } as TIPRestrictionsData;

    render(<ActionComponent cidr={cidr} />);

    fireEvent.click(screen.getByText('ip_restrictions_edit_block'));

    expect(mockEditActualRow).toHaveBeenCalledWith('192.168.0.1/24');
    expect(mockReset).toHaveBeenCalledWith({ ipBlock: '192.168.0.1/24' });
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
