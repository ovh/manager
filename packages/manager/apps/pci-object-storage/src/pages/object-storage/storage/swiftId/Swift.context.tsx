import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import storages from '@/types/Storages';
import { useGetSwift } from '@/data/hooks/swift-storage/useGetSwift.hook';

// Share data with the child routes
export type SwiftLayoutContext = {
  swift: storages.ContainerDetail;
  swiftQuery: UseQueryResult<storages.ContainerDetail, Error>;
};
export const useSwiftData = () => {
  const { projectId, swiftId } = useParams();
  const swiftQuery = useGetSwift({
    projectId,
    containerId: swiftId,
    noObjects: false,
  });
  return { projectId, swift: swiftQuery.data, swiftQuery };
};
