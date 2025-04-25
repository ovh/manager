import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, render } from '@testing-library/react';
import { useGetTokens } from '@/hooks/api/database/token/useToken.hook';
import { useDatagridColumns } from '@/hooks/token/useDatagridColumns';
import { TokenData } from '@/types/cloud/project/database/token';

vi.mock('@/hooks/api/database/token/useToken.hook', () => ({
  useGetTokens: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQueries: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockedUseGetTokens = vi.mocked(useGetTokens);
const mockedUseQueries = vi.mocked(useQueries);

describe('useDatagridColumns', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const projectId = 'testProject';
  const noLimitation = new Date('2099-01-01T00:00:00Z');
  const onUpdate = vi.fn();
  const onDelete = vi.fn();

  it('should return correct columns, tokenItems and isLoading when no tokens', () => {
    mockedUseGetTokens.mockReturnValue({
      data: [],
      isLoading: false,
    } as UseQueryResult<string[], Error>);
    mockedUseQueries.mockReturnValue([]);

    const { result } = renderHook(() =>
      useDatagridColumns({ projectId, noLimitation, onUpdate, onDelete }),
    );

    expect(result.current.tokenItems).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.columns).toHaveLength(4);
  });

  it('should compute tokenItems and isLoading correctly', () => {
    const tokenData: TokenData = {
      name: 'token1',
      description: 'desc',
      expiresAt: '2024-01-01T00:00:00Z',
      projectId,
    };

    mockedUseGetTokens.mockReturnValue({
      data: ['token1'],
      isLoading: false,
    } as UseQueryResult<string[], Error>);
    mockedUseQueries.mockReturnValue([{ data: tokenData, isLoading: false }]);

    const { result } = renderHook(() =>
      useDatagridColumns({ projectId, noLimitation, onUpdate, onDelete }),
    );

    expect(result.current.tokenItems).toEqual([tokenData]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should set isLoading to true if any query is loading', () => {
    const tokenData: TokenData = {
      name: 'token1',
      description: 'desc',
      expiresAt: '2024-01-01T00:00:00Z',
      projectId,
    };

    mockedUseGetTokens.mockReturnValue({
      data: ['token1'],
      isLoading: false,
    } as UseQueryResult<string[], Error>);
    mockedUseQueries.mockReturnValue([{ data: tokenData, isLoading: true }]);

    const { result } = renderHook(() =>
      useDatagridColumns({ projectId, noLimitation, onUpdate, onDelete }),
    );

    expect(result.current.isLoading).toBe(true);
  });

  it('should render expiresAt column correctly when token.expiresAt equals noLimitation', () => {
    const tokenData: TokenData = {
      name: 'token1',
      description: 'desc',
      expiresAt: noLimitation.toISOString(),
      projectId,
    };

    mockedUseGetTokens.mockReturnValue({
      data: ['token1'],
      isLoading: false,
    } as UseQueryResult<string[], Error>);
    mockedUseQueries.mockReturnValue([{ data: tokenData, isLoading: false }]);

    const { result } = renderHook(() =>
      useDatagridColumns({ projectId, noLimitation, onUpdate, onDelete }),
    );

    const expiresColumn = result.current.columns.find(
      (col) => col.id === 'expiresAt',
    );
    const { container } = render(expiresColumn?.cell(tokenData));
    expect(container.textContent).toContain('ai_endpoints_token_expiration');
  });

  it('should render actions column and trigger onUpdate and onDelete', () => {
    const tokenData: TokenData = {
      name: 'token1',
      description: 'desc',
      expiresAt: '2024-01-01T00:00:00Z',
      projectId,
    };

    mockedUseGetTokens.mockReturnValue({
      data: ['token1'],
      isLoading: false,
    } as UseQueryResult<string[], Error>);
    mockedUseQueries.mockReturnValue([{ data: tokenData, isLoading: false }]);

    const { result } = renderHook(() =>
      useDatagridColumns({ projectId, noLimitation, onUpdate, onDelete }),
    );

    const actionsColumn = result.current.columns.find(
      (col) => col.id === 'actions',
    );
    const { getByText } = render(actionsColumn?.cell(tokenData));

    const updateElement = getByText('ai_endpoints_token_put');
    const deleteElement = getByText('ai_endpoints_token_delete');

    updateElement.click();
    expect(onUpdate).toHaveBeenCalledWith(tokenData);

    deleteElement.click();
    expect(onDelete).toHaveBeenCalledWith(tokenData);
  });
});
