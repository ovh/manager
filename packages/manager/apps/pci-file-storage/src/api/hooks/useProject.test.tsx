import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useProject } from './useProject';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useProject', () => {
  it('should return the correct project data', () => {
    const mockProjectId = '12345';
    const mockProjectData = {
      description: 'Mock Project',
      project_id: mockProjectId,
      status: 'active',
      planCode: 'mock-plan',
      access: 'public',
      projectName: 'Mock Project Name',
    };

    (useQuery as jest.Mock).mockReturnValue({
      data: { data: mockProjectData },
      isError: false,
      isLoading: false,
      status: 'success',
    });

    const { result } = renderHook(() =>
      useProject({ projectId: mockProjectId }),
    );

    expect(result.current.project).toEqual(mockProjectData);
    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
