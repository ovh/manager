import { QueryClient } from '@tanstack/react-query';
import { getS3Storage } from '@/data/api/storage/s3Storage.api';

// Helper function to get the S3 storage container, utilizing the query client for caching
export async function getContainerHelper(
  queryClient: QueryClient,
  projectId: string,
  region: string,
  name: string,
) {
  return queryClient.fetchQuery({
    queryKey: [projectId, 'region', region, 'storage', name],
    queryFn: () =>
      getS3Storage({
        projectId,
        region,
        name,
      }),
  });
}
