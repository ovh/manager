import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useRestrictionColumns } from './useRestrictionColumns';

describe('useRestrictionColumns', () => {
  const mockOnSave = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnClose = vi.fn();
  const mockDisabled = false;

  it('should return the correct columns', () => {
    const { result } = renderHook(() =>
      useRestrictionColumns({
        onSave: mockOnSave,
        onDelete: mockOnDelete,
        onClose: mockOnClose,
        disabled: mockDisabled,
      }),
    );

    const columns = result.current;

    expect(columns).toHaveLength(1);

    const allowedClientsColumn = columns.find((col) => col.id === 'allowed-clients');
    expect(allowedClientsColumn).toBeDefined();
    expect(allowedClientsColumn?.label).toBe('kube_restrictions_allowed_clients');
  });
});
