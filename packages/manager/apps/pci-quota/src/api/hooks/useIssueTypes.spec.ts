import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGetIssueTypes } from './useIssueTypes';
import { getIssueTypes } from '../data/issue';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/api/data/issue', () => ({
  getIssueTypes: vi.fn(),
}));

describe('useGetIssueTypes', () => {
  it('fetches issue types successfully', async () => {
    // Arrange
    const mockData = [
      {
        fields: [
          {
            default: 'default',
            description: 'description',
            id: 1,
            label: 'label',
            mandatory: true,
            rank: 1,
            readOnly: false,
          },
        ],
        hasChildren: false,
        id: 1,
        label: 'label',
        rank: 1,
        readOnly: false,
        selfCareResources: [
          {
            id: 1,
            label: 'label',
            rank: 1,
            tip: 'tip',
            type: 'type',
            url: 'url',
          },
        ],
        subject: 'subject',
      },
    ];
    const language = 'en';
    vi.mocked(getIssueTypes).mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => useGetIssueTypes(language), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it('handles errors when fetching issue types', async () => {
    // Arrange
    const language = 'en';
    const errorMessage = 'Network Error';
    vi.mocked(getIssueTypes).mockRejectedValue(new Error(errorMessage));

    // Act
    const { result } = renderHook(() => useGetIssueTypes(language), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Assert
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
