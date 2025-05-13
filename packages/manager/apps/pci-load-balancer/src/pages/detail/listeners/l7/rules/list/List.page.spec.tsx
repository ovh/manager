import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import L7RulesList from './List.page';
import { useL7Rules } from '@/api/hook/useL7Rule';
import { TL7Rule } from '@/api/data/l7Rules';

vi.mock('@/api/hook/useL7Rule');

describe('L7RulesList', () => {
  it('displays spinner when data is pending', () => {
    vi.mocked(useL7Rules).mockReturnValue({
      paginatedL7Rules: { rows: [], totalRows: 0, pageCount: 0 },
      allL7Rules: [],
      isLoading: true,
      isPending: true,
      error: undefined,
    });

    render(<L7RulesList />);

    expect(screen.getByTestId('List-spinner')).toBeInTheDocument();
  });

  it('display data in datagrid while data is available', () => {
    const mockRules = [
      {
        id: 'id',
        ruleType: 'ruleType',
        key: 'key',
        value: 'value',
        compareType: 'comparator',
      },
    ] as TL7Rule[];
    vi.mocked(useL7Rules).mockReturnValue({
      paginatedL7Rules: { rows: mockRules, totalRows: 1, pageCount: 1 },
      allL7Rules: mockRules,
      isLoading: false,
      isPending: false,
      error: undefined,
    });
    render(<L7RulesList />);
    expect(screen.getByText('ruleType')).toBeInTheDocument();
  });
});
