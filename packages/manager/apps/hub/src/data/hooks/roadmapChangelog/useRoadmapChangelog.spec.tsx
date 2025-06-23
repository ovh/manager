import { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { aapi as Api } from '@ovh-ux/manager-core-api';
import { useRoadmapChangelog } from '@/data/hooks/roadmapChangelog/useRoadmapChangelog';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { RoadmapChangelogResponse } from '@/types/roadmapchangelog.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useRoadmapChangelog', () => {
  it('should return roadmap changelog data', async () => {
    const roadmapChangelog: ApiEnvelope<RoadmapChangelogResponse> = {
      data: {
        cloud: [
          {
            title: 'title',
            description: 'description',
            changelog: 'changelog',
            product: 'product',
            releaseDate: 'releaseDate',
            status: 'status',
          },
        ],
        hostingCollab: [
          {
            title: 'title',
            description: 'description',
            changelog: 'changelog',
            product: 'product',
            releaseDate: 'releaseDate',
            status: 'status',
          },
        ],
      },
      status: 'OK',
    };
    const getRoadmapChangelog = vi
      .spyOn(Api, 'get')
      .mockReturnValue(Promise.resolve(roadmapChangelog));

    const { result } = renderHook(() => useRoadmapChangelog(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getRoadmapChangelog).toHaveBeenCalled();
      expect(result.current.data).toEqual(roadmapChangelog.data);
    });
  });
});
